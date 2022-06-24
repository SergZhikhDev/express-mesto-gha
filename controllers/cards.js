const Card = require("../models/card");

const CORRECT_CODE = 200; //«хорошо»
const ERROR_CODE = 400; //переданы некорректные данные в методы создания карточки
const NOT_FOUND_CODE = 404; //карточка не найдена.
const SERVER_ERROR_CODE = 500; //ошибка по-умолчанию.

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(CORRECT_CODE).send(card))
    .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: "Ошибка по-умолчанию" }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const likes = [];
  const { name, link } = req.body;
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => {
      res.status(CORRECT_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(CORRECT_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию' });
    });
  }

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(CORRECT_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию' });
    });
};

module.exports.delLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(CORRECT_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятии лайка' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для  снятии лайка' });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка по умоланию' });
    });
};
