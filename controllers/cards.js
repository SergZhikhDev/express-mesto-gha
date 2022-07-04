/* eslint-disable max-len */
const BadRequestError = require('../utils/errorcodes/bad-request-error');
const NotFoundError = require('../utils/errorcodes/not-found-error');
const BadRequireToken = require('../utils/errorcodes/bad-require-token');

const Card = require('../models/card');

const {
  CORRECT_CODE,
  CREATE_CODE,
} = require('../utils/correctcodes');

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.status(CORRECT_CODE).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(CREATE_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      console.log(req.params.cardId);
      console.log(req.user._id);
      if (!card) {
        console.log(1, card);
        next(new NotFoundError());
      }
      console.log(2, card.owner);
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        console.log(3);
        throw new BadRequireToken();
      }
      console.log(4);
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((cards) => {
      console.log(5);
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
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
      next(err);
    })
    .catch(next);
};

module.exports.delLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
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
      next(err);
    })
    .catch(next);
};
