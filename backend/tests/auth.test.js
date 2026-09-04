import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import { createTestUser } from "./helpers/testHelpers.js";
import jwt from "jsonwebtoken";

describe("Authentication API Integration Tests", () => {

    describe("POST /api/v1/auth/login", () => {

        test("should return 200 and set httpOnly cookies for valid credentials", async () => {
            const { rawPassword } = await createTestUser({
                email: "chef@tableflow.com",
                password: "SecurePassword123",
                role: "kitchen",
            });

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "chef@tableflow.com",
                    password: rawPassword,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe("chef@tableflow.com");
            expect(response.body.data.user.role).toBe("kitchen");
            expect(response.body.data.user.password).toBeUndefined();
            expect(response.body.data.user.refreshToken).toBeUndefined();

            // Verify cookies were set
            const cookies = response.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(true);
            expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
        });

        test("should return 401 for incorrect password", async () => {
            await createTestUser({
                email: "waiter@tableflow.com",
                password: "CorrectPassword",
            });

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "waiter@tableflow.com",
                    password: "WrongPassword999",
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("Invalid email or password");
        });

        test("should return 401 for non-existent email", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "nonexistent@tableflow.com",
                    password: "SomePassword123",
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test("should return 403 when user account is inactive", async () => {
            const { rawPassword } = await createTestUser({
                email: "inactive@tableflow.com",
                password: "Password123",
                active: false,
            });

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "inactive@tableflow.com",
                    password: rawPassword,
                });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("inactive");
        });

        test("should return 400 when email or password is missing", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "onlyemail@test.com" });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/auth/refresh-token", () => {

        test("should return 200 and rotate tokens when valid refreshToken cookie is provided", async () => {
            const { user } = await createTestUser();
            
            // Generate an initial token with a timestamp 10 seconds in the past
            const initialRefreshToken = jwt.sign(
                { _id: user._id, iat: Math.floor(Date.now() / 1000) - 10 },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
            );
            user.refreshToken = initialRefreshToken;
            await user.save();

            const response = await request(app)
                .post("/api/v1/auth/refresh-token")
                .set("Cookie", [`refreshToken=${initialRefreshToken}`]);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify new cookies were set
            const cookies = response.headers["set-cookie"];
            expect(cookies).toBeDefined();

            // Verify in DB that refreshToken was rotated and is different from the past token
            const updatedUser = await User.findById(user._id);
            expect(updatedUser.refreshToken).toBeDefined();
            expect(updatedUser.refreshToken).not.toBe(initialRefreshToken);
        });

        test("should return 401 when refreshToken cookie is missing", async () => {
            const response = await request(app)
                .post("/api/v1/auth/refresh-token");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test("should return 401 when refreshToken does not match DB (Token Mismatch / Replay Attack)", async () => {
            const { user } = await createTestUser();
            user.refreshToken = "valid_current_token_in_db";
            await user.save();

            // Client sends an old / forged token
            const oldToken = user.generateRefreshToken();

            const response = await request(app)
                .post("/api/v1/auth/refresh-token")
                .set("Cookie", [`refreshToken=${oldToken}`]);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/auth/logout", () => {

        test("should return 200, unset refreshToken from DB, and clear cookies", async () => {
            const { user, accessToken } = await createTestUser();
            user.refreshToken = "some_active_refresh_token";
            await user.save();

            const response = await request(app)
                .post("/api/v1/auth/logout")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify refreshToken was deleted from DB
            const updatedUser = await User.findById(user._id);
            expect(updatedUser.refreshToken).toBeUndefined();
        });

        test("should return 401 when logging out without authentication token", async () => {
            const response = await request(app)
                .post("/api/v1/auth/logout");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});