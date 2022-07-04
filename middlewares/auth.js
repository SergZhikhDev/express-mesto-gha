const { checkToken } = require('../utils/jwt');

const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');

  error.statusCode = 401;

  throw error;
};

// eslint-disable-next-line consistent-return

// eslint-disable-next-line consistent-return
const isAuthorized = ((req, res, next) => {
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
  } catch (err) {
    throwUnauthorizedError();
  }
});

module.exports = { isAuthorized };
