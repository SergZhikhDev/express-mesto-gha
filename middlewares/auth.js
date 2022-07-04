// const { checkToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = 'very_secret';

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

const isAuthorized = ((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw throwUnauthorizedError();
  }
  const token = () => jwt.verify(authorization.replace('Bearer ', ''), SECRET_KEY);
  const payload = token();
  try {
    User.findOne({ id: payload._id }).then((user) => {
      if (!user) {
        throwUnauthorizedError();
      }
    });
  } catch (err) {
    throwUnauthorizedError();
  }
  req.user = payload;

  next();
});

module.exports = { isAuthorized };
