const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message:
        err.message || "Something went wrong.",
    },
    meta: {
      requestId: req.id,
    },
  });
};

export default errorMiddleware;