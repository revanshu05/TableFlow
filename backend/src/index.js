import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import app from "./app.js";
import initializeRestaurantSettings from "./config/initializeRestaurantSettings.js";

dotenv.config({
    path: './env'
})

const port = (process.env.PORT || 8000);

connectDB()
.then(() => {
    await initializeRestaurantSettings();

    app.listen(port, () => {
        console.log("Server is running at port: ", port);
    })
})
.catch((error) => {
    console.log("---- MongoDB connection failed !!", error);
})