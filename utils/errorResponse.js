class ErrorResponse extends Error {
  constructor(message, statusCode) {
    //Because we are getting the message from the base class,we need to use super
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = ErrorResponse;
