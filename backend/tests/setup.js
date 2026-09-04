import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import initializeRestaurantSettings from "../src/config/initializeRestaurantSettings.js";

let replSet;

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_access_token_secret_key_12345";
process.env.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1d";
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "test_refresh_token_secret_key_12345";
process.env.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

// 1. Start an In-Memory Replica Set (enables MongoDB ACID transactions in tests!)
beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({
        replSet: { count: 1 },
    });
    const uri = replSet.getUri();
    await mongoose.connect(uri);
});

// 2. Clean collections and ensure restaurant settings exist before every test
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    await initializeRestaurantSettings();
});

// 3. Disconnect & teardown
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (replSet) {
        await replSet.stop();
    }
});