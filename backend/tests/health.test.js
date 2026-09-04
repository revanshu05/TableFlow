import request from "supertest";
import app from "../src/app.js";

describe("GET /api/v1/health", () => {
    test("should return 200 and healthy DB status", async () => {
        const response = await request(app).get("/api/v1/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("healthy");
        expect(response.body.database.status).toBe("connected");
        expect(response.body.uptime).toBeTypeOf("number");
        expect(response.body.timestamp).toBeDefined();
        expect(response.body.version).toBeDefined();
    });
});