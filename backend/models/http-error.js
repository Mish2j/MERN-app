class HttpError extends Error {
  constructor(message, errorConde) {
    super(message);
    return this.code;
  }
}

module.exports = HttpError;
