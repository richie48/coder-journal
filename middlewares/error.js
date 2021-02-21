const errorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  //copy the object in err to error
  let error = { ...err };
  error.message = err.message;

  //Now we can start making handlers for each of the type of error
  if (err.name === 'CastError') {
    const message = `Note with id of ${err.value} cannot be found`;
    error = new errorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `object ${err.value} is a duplicate`;
    error = new errorResponse(message, 404);
  }

  //Validation errors can come as an array of errors
  if (err.name === 'ValidationError') {
    const message = object.value(err.errors).map((val) => val.message);
    error = new errorResponse(message, 404);
  }

  if (err.name === 'TypeError') {
    const message = `object ${err.value} is invalid`;
    error = new errorResponse(message, 404);
  }

  console.log(`This is a ${err.name}`.red.underline);
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'server error' });

  next();
};

module.exports = errorHandler;
