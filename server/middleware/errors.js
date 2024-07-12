const ErrorHandler = require('../utlis/ErrorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err };
        error.message = err.message;

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((value) => value.message);
            error = new ErrorHandler(message, 400);
        }
        if (err.name === 'CastError') {
            const message = `Resource not found Invalid: ${err.path}`;
            error = new ErrorHandler(message, 404);
        }
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }
        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
};