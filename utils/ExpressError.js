class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.messages = message;
    this.statusCode = statusCode
  }
}

module.exports = ExpressError