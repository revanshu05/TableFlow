import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import initializeRestaurantSettings from "./config/initializeRestaurantSettings.js";
import logger from "./utils/logger.js";
import { initializeSocket } from "./socket/socket.service.js";
import http from "http";


dotenv.config({
    path: './env'
})

const port = (process.env.PORT || 8000);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
    .then(() => {
        initializeRestaurantSettings();

        server.listen(port, () => {
            logger.info(`Server is running at port: ${port}`);
        });
    })
    .catch((error) => {
        logger.error(
            { err: error }, 
            "MongoDB connection failed");
    });