export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'This resource does not exist.' });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong. Please try again.' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
}
