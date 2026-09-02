import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";


const socketAuth = async (socket, next) => {
    try {
        let token = socket.handshake.auth?.token;

        if(!token && socket.handshake.headers?.cookie){
            const parsedCookies = parseCookie(socket.handshake.headers.cookie);
            token = parsedCookies.accessToken;
        }

        if(!token){
            return next(new Error("Authentication error: Access token missing"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id)
            .select("-password -refreshToken");

        if(!user){
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = user;
        next();
    } 
    catch (error) {
        logger.warn({ err: error.message }, "Socket handshake authentication rejected");
        next(new Error("Authentication error: Invalid or expired token"));
    }
};

export { socketAuth };