import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
	let error = err instanceof Error ? err : new Error(String(err));

	const requestId = req.id || "-";

	let statusCode = error.statusCode || 500;

	if(error.name === "CastError"){
		statusCode = 400;
		error.message = `Invalid ${error.path} identifier`;
	}
	else if(error.name === "ValidationError"){
		statusCode = 400;
		error.errors = Object.values(error.errors || {}).map(e => ({ 
			field: e.path, 
			message: e.message
		}));
	}
	else if(error.code === 11000){
		statusCode = 409;
		const key = Object.keys(error.keyValue || {}).join(", ");
		error.message = `${key} already exists`;
	}
	else if(error.name === "TokenExpiredError") {
		statusCode = 401;
		error.message = "Authentication token expired";
	}
	else if(error.name === "JsonWebTokenError") {
		statusCode = 401;
		error.message = "Invalid authentication token";
	}

	logger.error({ err: error, requestId }, "Unhandled error");

	const response = {
		success: false,
		message: error.message || "Internal Server Error",
		errors: error.errors || [],
		data: null,
		stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
	};

	return res.status(statusCode).json(response);
};

export default errorHandler;