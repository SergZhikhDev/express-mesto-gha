const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { log } = require('../middlewares/consolelog');// мидлвер создана для разработки, в дальнейшем удалю.

const {
  getCards,
  createCard,
  deleteCard,
  toggleLikeCard,
  // delLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string(), // .required().pattern(/^(https?:\/\/)(www\.)?
    // ([\w-.~:/?#[\]@!$&')(*+,;=]*\.?)*\.{1}[\w]{2,8}(\/([\w-.~:/?#[\]@!$&')(*+,;=])*)?/),
  }),
}), createCard);

router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', log, toggleLikeCard);
/* Заменил две функции (addLike , deleteLike), одной toggleLike */
// router.delete('/:cardId/likes', delLikeCard);
module.exports = router;
