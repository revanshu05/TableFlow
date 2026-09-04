import request from "supertest";
import app from "../src/app.js";
import Order from "../src/models/order.model.js";
import KitchenTicket from "../src/models/kitchenTicket.model.js";
import { createTestUser, createTestTable, createTestMenuItem } from "./helpers/testHelpers.js";

describe("Kitchen & KOT API Integration Tests", () => {

    describe("POST /api/v1/orders/:id/create-ticket", () => {

        test("should create KOT, snapshot menu item prices, and increment ticket count", async () => {
            const { user: waiter, accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable({ status: "OCCUPIED" });
            const menuItem = await createTestMenuItem({ name: "Paneer Tikka", price: 280, isAvailable: true });

            const order = await Order.create({
                table: table._id,
                waiter: waiter._id,
                orderNumber: 301,
                status: "OPEN",
                customer: { name: "Foodie", members: 2 },
                items: [],
                kotCount: 0,
            });

            const response = await request(app)
                .post(`/api/v1/orders/${order._id}/create-ticket`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    items: [
                        {
                            menuItem: menuItem._id,
                            quantity: 2,
                        },
                    ],
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe("PENDING");
            expect(response.body.data.ticketNumber).toBeDefined();

            // 💰 Verify Price Snapshotting:
            expect(response.body.data.items[0].unitPrice).toBe(280);
            expect(response.body.data.items[0].name).toBe("Paneer Tikka");

            // Verify Order was updated with subtotal & KOT count
            const updatedOrder = await Order.findById(order._id);
            expect(updatedOrder.kotCount).toBe(1);
            expect(updatedOrder.subtotal).toBe(560); // 280 * 2
        });

        test("should return 400 if menu item is unavailable (out of stock)", async () => {
            const { user: waiter, accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();
            const unavailableItem = await createTestMenuItem({ name: "Seasonal Dessert", isAvailable: false });

            const order = await Order.create({
                table: table._id,
                waiter: waiter._id,
                orderNumber: 302,
                status: "OPEN",
                customer: { name: "Guest", members: 1 },
            });

            const response = await request(app)
                .post(`/api/v1/orders/${order._id}/create-ticket`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    items: [{ menuItem: unavailableItem._id, quantity: 1 }],
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("not available");
        });

        test("should return 409 if order is no longer OPEN", async () => {
            const { user: waiter, accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();
            const menuItem = await createTestMenuItem();

            const closedOrder = await Order.create({
                table: table._id,
                waiter: waiter._id,
                orderNumber: 303,
                status: "PAYMENT_PENDING",
                customer: { name: "Guest", members: 1 },
            });

            const response = await request(app)
                .post(`/api/v1/orders/${closedOrder._id}/create-ticket`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    items: [{ menuItem: menuItem._id, quantity: 1 }],
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("no more OPEN");
        });
    });

    describe("PATCH /api/v1/kitchen-tickets/:ticketId/:action", () => {

        test("should allow valid state transitions: PENDING -> PREPARING -> READY -> SERVED", async () => {
            const { accessToken: cookToken } = await createTestUser({ role: "kitchen" });
            const { user: waiter } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();

            const order = await Order.create({
                table: table._id,
                waiter: waiter._id,
                orderNumber: 304,
                status: "OPEN",
                customer: { name: "Guest", members: 1 },
            });

            const ticket = await KitchenTicket.create({
                order: order._id,
                table: table._id,
                waiter: waiter._id,
                ticketNumber: 1,
                status: "PENDING",
                items: [{ menuItem: table._id, name: "Burger", quantity: 1, unitPrice: 150 }],
            });

            // 1. Cook starts cooking: PENDING -> PREPARING
            const step1 = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/start`)
                .set("Authorization", `Bearer ${cookToken}`);

            expect(step1.status).toBe(200);
            expect(step1.body.data.status).toBe("PREPARING");

            // 2. Cook finishes cooking: PREPARING -> READY
            const step2 = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/ready`)
                .set("Authorization", `Bearer ${cookToken}`);

            expect(step2.status).toBe(200);
            expect(step2.body.data.status).toBe("READY");

            // 3. Staff marks served: READY -> SERVED
            const step3 = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/served`)
                .set("Authorization", `Bearer ${cookToken}`);

            expect(step3.status).toBe(200);
            expect(step3.body.data.status).toBe("SERVED");
        });

        test("should reject invalid state transitions (e.g. jumping from PENDING directly to SERVED)", async () => {
            const { accessToken: cookToken } = await createTestUser({ role: "kitchen" });
            const table = await createTestTable();

            const ticket = await KitchenTicket.create({
                order: table._id,
                table: table._id,
                waiter: table._id,
                ticketNumber: 2,
                status: "PENDING",
                items: [{ menuItem: table._id, name: "Salad", quantity: 1, unitPrice: 100 }],
            });

            // Cook tries to mark "served" directly on a PENDING ticket
            const response = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/served`)
                .set("Authorization", `Bearer ${cookToken}`);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("status was changed earlier by another request or is not in valid status");
        });

        test("should return 403 when waiter tries to update kitchen ticket status", async () => {
            const { accessToken: waiterToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();

            const ticket = await KitchenTicket.create({
                order: table._id,
                table: table._id,
                waiter: table._id,
                ticketNumber: 3,
                status: "PENDING",
                items: [{ menuItem: table._id, name: "Soup", quantity: 1, unitPrice: 80 }],
            });

            // Waiter is not allowed on /:ticketId/:action (kitchen/admin only)
            const response = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/start`)
                .set("Authorization", `Bearer ${waiterToken}`);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/kitchen-tickets/:ticketId (Editing KOTs)", () => {

        test("should return 400 when attempting to edit a ticket that is already PREPARING (PENDING-only editing)", async () => {
            const { user: waiter, accessToken: waiterToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();

            const order = await Order.create({
                table: table._id,
                waiter: waiter._id,
                orderNumber: 305,
                status: "OPEN",
                customer: { name: "Guest", members: 1 },
            });

            const ticket = await KitchenTicket.create({
                order: order._id,
                table: table._id,
                waiter: waiter._id,
                ticketNumber: 4,
                status: "PREPARING", // Cooking already started!
                items: [{ menuItem: table._id, name: "Burger", quantity: 1, unitPrice: 150 }],
            });

            const response = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}`)
                .set("Authorization", `Bearer ${waiterToken}`)
                .send({
                    items: [{ menuItem: table._id, quantity: 2, action: "ADD" }],
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Only pending KOTs can be edited");
        });

        test("should return 403 when a different waiter attempts to edit another waiter's KOT (waiter ownership)", async () => {
            const { user: waiter1 } = await createTestUser({ role: "waiter" });
            const { accessToken: waiter2Token } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();

            // Order owned by waiter 1
            const order = await Order.create({
                table: table._id,
                waiter: waiter1._id,
                orderNumber: 306,
                status: "OPEN",
                customer: { name: "Guest", members: 1 },
            });

            const ticket = await KitchenTicket.create({
                order: order._id,
                table: table._id,
                waiter: waiter1._id,
                ticketNumber: 5,
                status: "PENDING",
                items: [{ menuItem: table._id, name: "Burger", quantity: 1, unitPrice: 150 }],
            });

            // Waiter 2 tries to modify waiter 1's ticket
            const response = await request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}`)
                .set("Authorization", `Bearer ${waiter2Token}`)
                .send({
                    items: [{ menuItem: table._id, quantity: 2, action: "ADD" }],
                });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("not authorized to modify KOTs for this order");
        });
    });
});