/* eslint-disable consistent-return */
const AnotherServerError = ('../errors/another-server-error');
const BadRequestError = ('../errors/bad-request-error');
// const BadRequireToken = ('../errors/bad-require-token');
const NotFoundError = ('../errors/not-found-error');
// const NotUniqueEmailError = ('../errors/not-unique-email');

const Card = require('../models/card');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/errorcodes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new AnotherServerError('Ошибка по-умолчанию');
      }
      res.status(CORRECT_CODE).send(card);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => {
      res.status(CREATE_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена.'));
        return;
      }

      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        next(new BadRequestError('Невозможно удалить карточку.'));
        return;
      }

      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.status(CORRECT_CODE).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.status(CORRECT_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};

module.exports.delLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.status(CORRECT_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для запроса'));
      }
      next(new AnotherServerError('Ошибка по-умолчанию'));
    });
};
