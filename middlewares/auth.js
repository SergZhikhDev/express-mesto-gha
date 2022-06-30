/* eslint-disable consistent-return */
const { checkToken } = require('../helpers/jwt');
const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

const isAuthorized = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);

    User.findOne({ email: payload.email }).then((user) => {
      if (!user) {
        throwUnauthorizedError();
      }

      req.user = { id: user._id };

      next();
    });
  } catch (e) {
    throwUnauthorizedError();
  }
};

module.exports = { isAuthorized };
