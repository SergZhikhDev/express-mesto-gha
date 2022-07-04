const { checkToken } = require('../utils/jwt');
const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

// eslint-disable-next-line consistent-return
const isAuthorized = ((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  const payload = checkToken(token);
  try {
    User.findOne({ email: payload._id }).then((user) => {
      if (!user) {
        throwUnauthorizedError();
      }

      // req.user = { id: user._id };

      // next();
    });
  } catch (err) {
    throwUnauthorizedError();
  }
  req.user = payload;

  next();
});

module.exports = { isAuthorized };
