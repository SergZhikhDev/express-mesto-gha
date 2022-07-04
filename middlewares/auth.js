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
    throw res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    /* Как раз для того, чтобы при каждом запросе не дёргать бд, для получения идентификатор,
 нужно сразу писать _id в payload и при авторизации мы сразу получаем нужные нам данные */
    User.findOne({ id: payload._id }).then((user) => { // стало
    // User.findOne({ email: payload.email }).then((user) => { было
      if (!user) {
        throwUnauthorizedError();
      }

      req.user = { _id: user._id };

      next();
    });
  } catch (err) {
    throwUnauthorizedError();
  }
});

module.exports = { isAuthorized };
