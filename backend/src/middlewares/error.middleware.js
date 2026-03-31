const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.path}`, err.message)
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        path: req.path,
        timestamp: new Date().toISOString()
    })
}

module.exports = { errorHandler }