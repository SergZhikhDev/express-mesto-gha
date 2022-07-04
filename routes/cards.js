const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { log } = require('../middlewares/consolelog');// мидлвер создана для разработки, в дальнейшем удалю.
const { LinksRegExp /* IdRegExp */ } = require('../utils/all-reg-exp');

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
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(LinksRegExp),
  }),
}), createCard);

router.delete(
  '/:cardId', /* celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(IdRegExp).length(24), // Тоже самое, что и в роутах users
  }),
}) */ deleteCard,
);

router.put('/:cardId/likes', log, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), delLikeCard);
module.exports = router;
