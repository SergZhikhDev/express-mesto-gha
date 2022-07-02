const validate = require('mongoose-validator');

module.exports.userNameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 30],
    message: 'Поле "name" должно содержать от {ARGS[0]} до {ARGS[1]} символов',
  }),
];

module.exports.userAboutValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 30],
    message: 'Поле "about" должно содержать от {ARGS[0]} до {ARGS[1]} символов',
  }),
];

module.exports.userAvatarValidator = [
  // validate({
  //   validator: 'matches',
  //   arguments: /^[a-zA-Z-]+$/i,
  //   message: '',
  // }),
  validate({
    validator: 'isLength',
    arguments: [2, 150],
    message: 'Поле "name" должно содержать от {ARGS[0]} до {ARGS[1]} символов',
  }),

];

module.exports.userEmailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Не верный формат электронной почты',
  }),

];
module.exports.userPasswordValidator = [
  validate({
    validator: 'isLength',
    arguments: [8],
    select: false,
    message: 'Поле "password" должно содержать не менее {ARGS[0]} символов',
  }),
];
module.exports.cardNameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 30],
    message: 'Поле "name" должно содержать от {ARGS[0]} до {ARGS[1]} символов',
  }),

];
module.exports.cardLinkValidator = [
  // validate({
  //   validator: 'matches',
  //   arguments: /^[a-zA-Z-]+$/i,
  //   message: '',
  // }),
  validate({
    validator: 'isLength',
    arguments: [2, 150],
    message: 'Поле "name" должно содержать от {ARGS[0]} до {ARGS[1]} символов',
  }),
];