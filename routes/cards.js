/* eslint-disable max-len */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { log } = require('../middlewares/consolelog');// мидлвер создана для разработки, в дальнейшем удалю.
const { LinksRegExp } = require('../utils/all-reg-exp');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  delLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().pattern(LinksRegExp),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', log, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);
/* Заменил две функции (addLike , deleteLike), одной toggleLike */
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), delLikeCard);
module.exports = router;
