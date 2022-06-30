/* eslint-disable no-unused-expressions */
/* eslint-disable no-unreachable */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const AnotherServerError = require('../errors/another-server-error');
const BadRequestError = require('../errors/bad-request-error');
const BadRequireToken = require('../errors/bad-require-token');
const NotFoundError = require('../errors/not-found-error');
const NotUniqueEmailError = require('../errors/not-unique-email');

const User = require('../models/user');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/errorcodes');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) =>
      /* Проверку убрал т.к. если нет пользователей,
      то будет ответ из мидлвары "Авторизуйтесь для доступа" */
      // if (!users) {
      //   throw new BadRequireToken('Нет данных для ответа');
      // }
      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(CORRECT_CODE).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User
    .findById(req.body._id)

    .then((user) => {
      if (!user) {
        throw new BadRequireToken('Нет данных для ответа');
      }
      res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному id не найден.'));
        return;
      }
      next();
    })
    .catch(next);
};

module.exports.getUserSelfInfo = (req, res, next) => {
  const { _id } = req.user.id;
  User.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан пароль или емейл' });
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(CREATE_CODE).send(user))
    .catch((err) => {
      // if (err.name === 'ValidationError') {
      //   next(new BadRequestError('Переданы некорректные данные для запроса'));
      // }
      // теперь есть дефолтные значения
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new NotUniqueEmailError('Такой пользователь уже существует!'));
        return;
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log(2);
    return res.status(400).send({ message: 'Не передан пароль или емейл' });
  }
  User.findUserByCredentials(email, password)
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        const err = new Error('Не правильный пароль или емейл');
        err.statusCode = 403;
        throw err;
      }
      return generateToken({ email: user.email, expiresIn: '7d' });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
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
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }

      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }

      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};
