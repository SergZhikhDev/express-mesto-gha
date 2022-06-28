module.exports = class AnotherServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
};
