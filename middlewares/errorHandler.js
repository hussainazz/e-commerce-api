function errorHandler(err, req, res, next) {
    if (res.headersSent || !err.status) {
        return next(err);
    }
    res.status(err.status).json(err.message);
}

export default errorHandler;
