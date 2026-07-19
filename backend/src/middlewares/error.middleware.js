
const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof Error)) {
        error = new Error(String(error));
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || [],
        data: null,
        stack: process.env.NODE_ENV === "development"
            ? error.stack
            : undefined,
    });
};

export default errorHandler;