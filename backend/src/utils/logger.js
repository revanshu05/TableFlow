import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino(
    {
        level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
        base: undefined,
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    
    isDev ? pino.transport({
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: true
        }
    }) : undefined
);

export default logger;