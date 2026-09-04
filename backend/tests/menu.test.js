import request from "supertest";
import app from "../src/app.js";
import MenuItem from "../src/models/menu.model.js";
import { createTestUser } from "./helpers/testHelpers.js";

describe("Menu API Integration Tests", () => {

    describe("POST /api/v1/menu", () => {

        test("admin should successfully create a new menu item", async () => {
            const { accessToken: adminToken } = await createTestUser({ role: "admin" });

            const response = await request(app)
                .post("/api/v1/menu")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Crispy Spring Rolls",
                    description: "Vegetable rolls with sweet chili dip",
                    category: "STARTER",
                    price: 180,
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe("Crispy Spring Rolls");
            expect(response.body.data.price).toBe(180);
            expect(response.body.data.isAvailable).toBe(true);
        });

        test("should return 403 when non-admin (waiter) attempts to create menu item", async () => {
            const { accessToken: waiterToken } = await createTestUser({ role: "waiter" });

            const response = await request(app)
                .post("/api/v1/menu")
                .set("Authorization", `Bearer ${waiterToken}`)
                .send({
                    name: "Unauthorized Dish",
                    category: "MAIN_COURSE",
                    price: 200,
                });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });

        test("should return 409 for duplicate dish name (case-insensitive)", async () => {
            const { accessToken: adminToken } = await createTestUser({ role: "admin" });

            await MenuItem.create({
                name: "Garlic Bread",
                category: "STARTER",
                price: 120,
            });

            // Attempt to create "garlic bread" in lowercase
            const response = await request(app)
                .post("/api/v1/menu")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "garlic bread",
                    category: "STARTER",
                    price: 130,
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("already exists");
        });

        test("should return 400 for negative or zero price", async () => {
            const { accessToken: adminToken } = await createTestUser({ role: "admin" });

            const response = await request(app)
                .post("/api/v1/menu")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Free Soup",
                    category: "SOUP",
                    price: -50,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Price must be greater than 0");
        });

        test("should return 400 for invalid category", async () => {
            const { accessToken: adminToken } = await createTestUser({ role: "admin" });

            const response = await request(app)
                .post("/api/v1/menu")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Unknown Item",
                    category: "INVALID_CATEGORY_XYZ",
                    price: 100,
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Invalid category");
        });
    });

    describe("GET /api/v1/menu (Visibility Rules)", () => {

        test("waiter should only see available items, while admin sees all items", async () => {
            const { accessToken: waiterToken } = await createTestUser({ role: "waiter" });
            const { accessToken: adminToken } = await createTestUser({ role: "admin" });

            // 1 available dish, 1 out-of-stock dish
            await MenuItem.create({ name: "Available Dish", category: "MAIN_COURSE", price: 200, isAvailable: true });
            await MenuItem.create({ name: "Out of Stock Dish", category: "DESSERT", price: 150, isAvailable: false });

            // Waiter view -> Should only receive available item (1)
            const waiterRes = await request(app)
                .get("/api/v1/menu")
                .set("Authorization", `Bearer ${waiterToken}`);

            expect(waiterRes.status).toBe(200);
            expect(waiterRes.body.data.length).toBe(1);
            expect(waiterRes.body.data[0].name).toBe("Available Dish");

            // Admin view -> Should receive both items (2)
            const adminRes = await request(app)
                .get("/api/v1/menu")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(adminRes.status).toBe(200);
            expect(adminRes.body.data.length).toBe(2);
        });
    });
});