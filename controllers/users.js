const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const BadRequestError = require('../utils/errorcodes/bad-request-error');
const BadRequireToken = require('../utils/errorcodes/bad-require-token');
const NotFoundError = require('../utils/errorcodes/not-found-error');
const NotUniqueEmailError = require('../utils/errorcodes/not-unique-email');
const NotDataError = require('../utils/errorcodes/not-pass-or-email');
const User = require('../models/user');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/correctcodes');

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
        throw new BadRequireToken();
      }
      res.status(CORRECT_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError());
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

module.exports.createUser = ((req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError();
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
        next(new NotUniqueEmailError());
      }
      next(err);
    })
    .catch(next);
});

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError();
  }
  User.findUserByCredentials(email, password)
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw NotDataError();
      }
      return generateToken({ email: user.email, expiresIn: '7d' });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(CORRECT_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }

      next(err);
    })
    .catch(next);
};
