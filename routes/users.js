const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// мидлвер создана для разработки, в дальнейшем удалю.
const { log } = require('../middlewares/consolelog');
const { LinksRegExp } = require('../utils/all-reg-exp');

const {
  getUsers,
  getUserById,
  getUserSelfInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUsers);

router.get('/me', getUserSelfInfo);

router.get('/:userId', log, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(LinksRegExp),
  }),
}), updateAvatar);

module.exports = router;
