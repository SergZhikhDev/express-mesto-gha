const User = require("../models/user");

const CORRECT_CODE = 200; //«хорошо»
const ERROR_CODE = 400; //переданы некорректные данные в методы создания пользователя, обновления аватара пользователя или профиля;
const NOT_FOUND_CODE = 404; //пользователь не найден.
const SERVER_ERROR_CODE = 500; //ошибка по-умолчанию.

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(CORRECT_CODE).send(user))
    .catch((err) =>
      res.status(SERVER_ERROR_CODE).send({ message: "Ошибка по-умолчанию" })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      return res.status(CORRECT_CODE).send(user);
    })
    .catch((err) =>
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "Ошибка по-умолчанию" })
    );
};

module.exports.createUser = (req, res) => {
  User.create(req.body)
  .then((user) => res.status(CORRECT_CODE).send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию' });
  });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(CORRECT_CODE).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию' });
  });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(CORRECT_CODE).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию!' });
  });
}