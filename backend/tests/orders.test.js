import request from "supertest";
import app from "../src/app.js";
import Table from "../src/models/table.model.js";
import Order from "../src/models/order.model.js";
import KitchenTicket from "../src/models/kitchenTicket.model.js";
import { createTestUser, createTestTable, createTestMenuItem } from "./helpers/testHelpers.js";

describe("Orders API Integration Tests", () => {

    describe("POST /api/v1/orders", () => {

        test("should create order, occupy table, and return 201", async () => {
            const { accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable({ capacity: 4, status: "AVAILABLE" });

            const response = await request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    tableId: table._id,
                    customer: {
                        name: "Alice Smith",
                        phone: "9876543210",
                        members: 3,
                    },
                    notes: "Window seat preferred",
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe("OPEN");
            expect(response.body.data.orderNumber).toBeDefined();

            // Verify Table was marked OCCUPIED in database
            const updatedTable = await Table.findById(table._id);
            expect(updatedTable.status).toBe("OCCUPIED");
            expect(updatedTable.currentOrder.toString()).toBe(response.body.data._id);
        });

        test("should return 409 if table is already OCCUPIED", async () => {
            const { accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable({ status: "OCCUPIED" });

            const response = await request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    tableId: table._id,
                    customer: { name: "Bob", members: 2 },
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("occupied");
        });

        test("should return 400 if party size exceeds table capacity", async () => {
            const { accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable({ capacity: 2, status: "AVAILABLE" });

            const response = await request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    tableId: table._id,
                    customer: { name: "Large Family", members: 6 },
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("accommodate at most 2");
        });

        test("should return 400 for invalid table ID", async () => {
            const { accessToken } = await createTestUser({ role: "waiter" });

            const response = await request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    tableId: "invalid-id-format",
                    customer: { name: "Charlie", members: 1 },
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("PATCH /api/v1/orders/:id/request-bill", () => {

        test("should transition status to PAYMENT_PENDING when all KOTs are SERVED", async () => {
            const { user, accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable({ status: "OCCUPIED" });

            // Create an order with items
            const order = await Order.create({
                table: table._id,
                waiter: user._id,
                orderNumber: 101,
                status: "OPEN",
                customer: { name: "Diner", members: 2 },
                items: [{ menuItem: table._id, name: "Pizza", quantity: 1, unitPrice: 300 }],
                kotCount: 1,
            });

            // Create a SERVED kitchen ticket
            await KitchenTicket.create({
                order: order._id,
                table: table._id,
                waiter: user._id,
                ticketNumber: 1,
                status: "SERVED",
                items: [{ menuItem: table._id, name: "Pizza", quantity: 1, unitPrice: 300 }],
            });

            const response = await request(app)
                .patch(`/api/v1/orders/${order._id}/request-bill`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe("PAYMENT_PENDING");
            expect(response.body.data.requestedBillAt).toBeDefined();
        });

        test("should return 409 if any KOT is still unserved (e.g. PREPARING)", async () => {
            const { user, accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable({ status: "OCCUPIED" });

            const order = await Order.create({
                table: table._id,
                waiter: user._id,
                orderNumber: 102,
                status: "OPEN",
                customer: { name: "Diner 2", members: 2 },
                items: [{ menuItem: table._id, name: "Pasta", quantity: 1, unitPrice: 200 }],
                kotCount: 1,
            });

            // Ticket is still PREPARING
            await KitchenTicket.create({
                order: order._id,
                table: table._id,
                waiter: user._id,
                ticketNumber: 2,
                status: "PREPARING",
                items: [{ menuItem: table._id, name: "Pasta", quantity: 1, unitPrice: 200 }],
            });

            const response = await request(app)
                .patch(`/api/v1/orders/${order._id}/request-bill`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("All KOTs must be served first");
        });

        test("should return 400 if order has no items / 0 KOTs", async () => {
            const { user, accessToken } = await createTestUser({ role: "waiter" });
            const table = await createTestTable();

            const emptyOrder = await Order.create({
                table: table._id,
                waiter: user._id,
                orderNumber: 103,
                status: "OPEN",
                customer: { name: "Empty Order", members: 1 },
                items: [],
                kotCount: 0,
            });

            const response = await request(app)
                .patch(`/api/v1/orders/${emptyOrder._id}/request-bill`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("empty order");
        });
    });

    describe("PATCH /api/v1/orders/:id/complete-payment", () => {

        test("should complete payment, set order to COMPLETED, and free the table", async () => {
            const { user: cashierUser, accessToken: cashierToken } = await createTestUser({ role: "cashier" });
            const table = await createTestTable({ status: "OCCUPIED" });

            const order = await Order.create({
                table: table._id,
                waiter: cashierUser._id, // <--- Add waiter
                orderNumber: 104,
                status: "PAYMENT_PENDING",
                customer: { name: "Guest", members: 2 },
                items: [{ menuItem: table._id, name: "Curry", quantity: 1, unitPrice: 500 }],
                subtotal: 500,
                tax: 25,
                discount: 0,
                grandTotal: 525,
            });

            table.currentOrder = order._id;
            await table.save();

            const response = await request(app)
                .patch(`/api/v1/orders/${order._id}/complete-payment`)
                .set("Authorization", `Bearer ${cashierToken}`)
                .send({
                    paymentMethod: "UPI",
                    tip: 50,
                    discount: 25,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe("COMPLETED");
            expect(response.body.data.paymentStatus).toBe("PAID");
            expect(response.body.data.paymentMethod).toBe("UPI");
            expect(response.body.data.tip).toBe(50);
            expect(response.body.data.discount).toBe(25);

            const freedTable = await Table.findById(table._id);
            expect(freedTable.status).toBe("AVAILABLE");
            expect(freedTable.currentOrder).toBeNull();
        });

        test("should return 409 if order is not in PAYMENT_PENDING status", async () => {
            const { user: cashierUser, accessToken: cashierToken } = await createTestUser({ role: "cashier" });
            const table = await createTestTable();

            const openOrder = await Order.create({
                table: table._id,
                waiter: cashierUser._id, // <--- Add waiter
                orderNumber: 105,
                status: "OPEN",
                customer: { name: "Guest", members: 1 },
            });

            const response = await request(app)
                .patch(`/api/v1/orders/${openOrder._id}/complete-payment`)
                .set("Authorization", `Bearer ${cashierToken}`)
                .send({ paymentMethod: "CASH" });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("PAYMENT_PENDING");
        });

        test("should return 400 if discount exceeds total bill amount", async () => {
            const { user: cashierUser, accessToken: cashierToken } = await createTestUser({ role: "cashier" });
            const table = await createTestTable();

            const order = await Order.create({
                table: table._id,
                waiter: cashierUser._id, // <--- Add waiter
                orderNumber: 106,
                status: "PAYMENT_PENDING",
                customer: { name: "Guest", members: 1 },
                subtotal: 100,
                tax: 5,
            });

            const response = await request(app)
                .patch(`/api/v1/orders/${order._id}/complete-payment`)
                .set("Authorization", `Bearer ${cashierToken}`)
                .send({
                    paymentMethod: "CASH",
                    discount: 500,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Discount cannot exceed");
        });
    });

    describe("GET /api/v1/orders (Role-Based Access)", () => {

        test("waiter should ONLY see their own orders, while admin sees all orders", async () => {
            const { user: waiter1, accessToken: waiter1Token } = await createTestUser({ role: "waiter" });
            const { user: waiter2 } = await createTestUser({ role: "waiter" });
            const { accessToken: adminToken } = await createTestUser({ role: "admin" });

            const table1 = await createTestTable();
            const table2 = await createTestTable();

            // Waiter 1 order
            await Order.create({
                table: table1._id,
                waiter: waiter1._id,
                orderNumber: 201,
                status: "OPEN",
                customer: { name: "Guest 1", members: 2 },
            });

            // Waiter 2 order
            await Order.create({
                table: table2._id,
                waiter: waiter2._id,
                orderNumber: 202,
                status: "OPEN",
                customer: { name: "Guest 2", members: 2 },
            });

            // 1. Waiter 1 requests orders -> Should ONLY see 1 order (their own)
            const waiter1Res = await request(app)
                .get("/api/v1/orders")
                .set("Authorization", `Bearer ${waiter1Token}`);

            expect(waiter1Res.status).toBe(200);
            expect(waiter1Res.body.data.orders.length).toBe(1);
            expect(waiter1Res.body.data.orders[0].orderNumber).toBe(201);

            // 2. Admin requests orders -> Should see BOTH orders (2)
            const adminRes = await request(app)
                .get("/api/v1/orders")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(adminRes.status).toBe(200);
            expect(adminRes.body.data.orders.length).toBe(2);
        });
    });
});