import rateLimit from "express-rate-limit";
import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.js";

const createLimiter = ({windowMs, limit, message}) => {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            const requestId = req.id || "-";
            logger.warn(
                {
                    ip: req.ip,
                    path: req.originalUrl,
                    requestId,
                    limit: options.limit,
                    windowMs: options.windowMs,
                },
                "Rate limit exceeded"
            );

            next(new ApiError(429, message));
        },
    });
};

const globalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

const loginLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many login attempts from this IP, please try again after 15 minutes",
});

const refreshTokenLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: "Too many token refresh attempts, please try again later",
});

export {globalLimiter, loginLimiter, refreshTokenLimiter};