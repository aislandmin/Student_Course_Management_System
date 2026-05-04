module.exports = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server";

    res.status(status).json({
        success: false,
        status,
        message,
        // Only show stack trace in development
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};
