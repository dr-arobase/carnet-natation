function errorMiddleware(err, req, res, next){
  console.error(err);
  if(res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
}

module.exports = errorMiddleware;
