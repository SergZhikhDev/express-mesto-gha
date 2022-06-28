const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AnotherServerError = ('../errors/another-server-error');
const BadRequestError = ('../errors/bad-request-error');
const BadRequireToken = ('../errors/bad-require-token');
const NotFoundError = ('../errors/not-found-error');
const NotUniqueEmailError = ('../errors/not-unique-email');

const User = require('../models/user');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/errorcodes');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new AnotherServerError('Ошибка по-умолчанию');
      }
      res.status(CORRECT_CODE).send(user);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      throw new AnotherServerError('Ошибка по-умолчанию');
    });
};
module.exports.getUserSelfInfo = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ email: req.body.email, password: hash }))
    .then((user) => res.status(CREATE_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      if (err.code === 11000) {
        next(new NotUniqueEmailError('Такой пользователь уже существует!'));
        return;
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequireToken('Неправильные почта или пароль');
      }
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      }

      throw new AnotherServerError('Ошибка по-умолчанию');
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
      }

      throw new AnotherServerError('Ошибка по-умолчанию');
    });
};
