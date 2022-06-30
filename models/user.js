const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const isEmail = require('validator/lib/isEmail');// источник: //https://github.com/validatorjs/validator.js

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    // required: true,
    default: 'https://www.pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',

  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      //   return bcrypt.compare(password, user.password)
      //     .then((matched) => {
      //       if (!matched) {
      //         return Promise.reject(new Error('Неправильные почта или пароль'));
      //       }

      //       return user;
      //     });
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    });
};

module.exports = mongoose.model('user', userSchema);
