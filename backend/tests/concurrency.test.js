import request from "supertest";
import app from "../src/app.js";
import Table from "../src/models/table.model.js";
import Order from "../src/models/order.model.js";
import KitchenTicket from "../src/models/kitchenTicket.model.js";
import { createTestUser, createTestTable } from "./helpers/testHelpers.js";

describe("Concurrency & Race Condition Tests", () => {

    test("two simultaneous order requests on the same table: ONLY one succeeds, other gets 409", async () => {
        const { accessToken: waiter1Token } = await createTestUser({ role: "waiter" });
        const { accessToken: waiter2Token } = await createTestUser({ role: "waiter" });
        const table = await createTestTable({ capacity: 4, status: "AVAILABLE" });

        // Fire both HTTP order creations concurrently at the exact same millisecond!
        const [res1, res2] = await Promise.all([
            request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${waiter1Token}`)
                .send({
                    tableId: table._id,
                    customer: { name: "Party A", members: 2 },
                }),
            request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${waiter2Token}`)
                .send({
                    tableId: table._id,
                    customer: { name: "Party B", members: 3 },
                }),
        ]);

        const statuses = [res1.status, res2.status];

        // Exactly one must succeed (201), and exactly one must fail with conflict (409)
        expect(statuses).toContain(201);
        expect(statuses).toContain(409);

        // Verify only 1 order exists in database for this table
        const ordersInDb = await Order.find({ table: table._id });
        expect(ordersInDb.length).toBe(1);

        // Verify table status is OCCUPIED
        const tableInDb = await Table.findById(table._id);
        expect(tableInDb.status).toBe("OCCUPIED");
    });

    test("two simultaneous status transitions on the same KOT: ONLY one succeeds", async () => {
        const { accessToken: cook1Token } = await createTestUser({ role: "kitchen" });
        const { accessToken: cook2Token } = await createTestUser({ role: "kitchen" });
        const table = await createTestTable();

        const ticket = await KitchenTicket.create({
            order: table._id,
            table: table._id,
            waiter: table._id,
            ticketNumber: 501,
            status: "PENDING",
            items: [{ menuItem: table._id, name: "Pizza", quantity: 1, unitPrice: 200 }],
        });

        // Two cooks click "Start Cooking" at the exact same time!
        const [res1, res2] = await Promise.all([
            request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/start`)
                .set("Authorization", `Bearer ${cook1Token}`),
            request(app)
                .patch(`/api/v1/kitchen-tickets/${ticket._id}/start`)
                .set("Authorization", `Bearer ${cook2Token}`),
        ]);

        const statuses = [res1.status, res2.status];

        // One gets 200 OK, the other gets 409 Conflict
        expect(statuses).toContain(200);
        expect(statuses).toContain(409);

        // Ticket status must cleanly be PREPARING
        const ticketInDb = await KitchenTicket.findById(ticket._id);
        expect(ticketInDb.status).toBe("PREPARING");
    });

        test("two simultaneous order requests on DIFFERENT tables: BOTH must succeed with distinct order numbers", async () => {
        const { accessToken: waiter1Token } = await createTestUser({ role: "waiter" });
        const { accessToken: waiter2Token } = await createTestUser({ role: "waiter" });

        // Two completely different tables
        const table1 = await createTestTable({ capacity: 4, status: "AVAILABLE" });
        const table2 = await createTestTable({ capacity: 2, status: "AVAILABLE" });

        // Fire both order creations concurrently!
        const [res1, res2] = await Promise.all([
            request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${waiter1Token}`)
                .send({
                    tableId: table1._id,
                    customer: { name: "Table 1 Guests", members: 3 },
                }),
            request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${waiter2Token}`)
                .send({
                    tableId: table2._id,
                    customer: { name: "Table 2 Guests", members: 2 },
                }),
        ]);

        // 1. Both requests must succeed with 201 Created
        expect(res1.status).toBe(201);
        expect(res2.status).toBe(201);

        // 2. Both orders must receive distinct, non-identical order numbers
        const orderNum1 = res1.body.data.orderNumber;
        const orderNum2 = res2.body.data.orderNumber;
        expect(orderNum1).toBeDefined();
        expect(orderNum2).toBeDefined();
        expect(orderNum1).not.toBe(orderNum2);

        // 3. Both tables must now be marked OCCUPIED in database
        const updatedTable1 = await Table.findById(table1._id);
        const updatedTable2 = await Table.findById(table2._id);
        expect(updatedTable1.status).toBe("OCCUPIED");
        expect(updatedTable2.status).toBe("OCCUPIED");
    });
});