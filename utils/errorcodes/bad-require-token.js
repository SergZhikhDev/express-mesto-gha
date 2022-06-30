module.exports = class BadRequireToken extends Error {
  constructor(message) {
    super(message);
    this.message = 'Токен не верный';
    this.statusCode = 401;
  }
};
