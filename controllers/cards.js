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
  // const owner = req.user.id;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user.id,
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
      if (!card) {
        throw new BadRequireToken();// dddddddddddd
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.id)) {
        throw new BadRequestError();
      }

      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }
      next(err);
    });
};
// /* Заменил две функции (addLike , deleteLike), одной toggleLike */
// module.exports.toggleLikeCard = (req, res, next) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       console.log(card);
//       // console.log(req.params.cardId);
//       const inSet = card.likes.indexOf(req.user.id);
//       const likeCard = ` ${'req.params.cardId, { $addToSet: { likes: req.user.id } }, { new: true }'}`;

//       const disLikeCard = ` ${'req.params.cardId, { $pull: { likes: req.user.id } }, { new: true }'}`;

//       console.log(likeCard);
//       // console.log(disLikeCard);
//       const toggleLikeCard = inSet < 0 ? likeCard : disLikeCard;
//       console.log(toggleLikeCard);
//       return Card.findByIdAndUpdate(toggleLikeCard);
//     })

//     .then(
//       (card) => {
//         console.log(81, card);
//         if (!card) {
//           throw new NotFoundError();
//         }
//         res.status(CORRECT_CODE).send(card);
//       },
//     )
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError());
//       }
//       next(err);
//     })
//     .catch(next);
// };

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
