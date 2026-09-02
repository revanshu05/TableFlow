import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URI?.replace("/api/v1", "");

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});