export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.isOperational
        ? err.message
        : "Something went wrong, please try again later.",
    });
  };
  