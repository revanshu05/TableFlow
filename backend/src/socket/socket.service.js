import {Server} from "socket.io";
import { socketAuth } from "./socket.middleware.js";
import logger from "../utils/logger.js";

let io = null;

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        const user = socket.user;

        logger.info(
            {
                socketId: socket.id,
                userId: user._id,
                role: user.role,
            },
            "Socket client connected"
        );

        socket.join(`room:user_${user._id}`);

        if(user.role === "kitchen" || user.role === "admin")
            socket.join("room:kitchen");

        if(user.role === "cashier" || user.role === "admin")
            socket.join("room:cashier");

        if(user.role === "waiter" || user.role === "admin")
            socket.join("room:waiter");

        if(user.role === "admin")
            socket.join("room:admin");

        
        socket.on("disconnect", (reason) => {
            logger.info(
                {
                    socketId: socket.id,
                    userId: user._id,
                    reason,
                },
                "Socket client disconnected"
            );
        });
    });

    return io;
}


const getIO = () => {
    if(!io){
        throw new Error("Socket.io has not been initialized");
    }
    return io;
}

const emitToRooms = (rooms, event, data) => {
    if(!io) return;

    const roomList = Array.isArray(rooms) ? rooms : [rooms];

    let broadcaster = io;

    for(const room of roomList){
        broadcaster = broadcaster.to(room);
    }

    broadcaster.emit(event, data);
}

const emitToUser = (userId, event, data) => {
    if(io){
        io.to(`room:user_${userId}`).emit(event, data);
    }
};


export {initializeSocket, getIO, emitToRooms, emitToUser};