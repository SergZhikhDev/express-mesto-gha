/* eslint-disable max-len */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { log } = require('../middlewares/consolelog');// мидлвер создана для разработки, в дальнейшем удалю.

const {
  getUsers,
  getUserById,
  getUserSelfInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', log, getUserById);

router.get('/me', getUserSelfInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w-.~:/?#[\]@!$&')(*+,;=]*\.?)*\.{1}[\w]{2,8}(\/([\w-.~:/?#[\]@!$&')(*+,;=])*)?/),
  }),
}), updateAvatar);
module.exports = router;
