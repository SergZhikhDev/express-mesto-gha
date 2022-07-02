const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const NotDataError = require('../utils/errorcodes/not-pass-or-email');

const {
  userNameValidator,
  userAboutValidator,
  userAvatarValidator,
  userEmailValidator,
  userPasswordValidator,
} = require('../validators/validators');

// const isEmail = require('validator/lib/isEmail');// источник: //https://github.com/validatorjs/validator.js

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'test',
    validate: userNameValidator,
  },
  about: {
    type: String,
    default: 'ab',
    validate: userAboutValidator,
  },
  avatar: {
    type: String,
    default: 'https://ya.ru/av.bmp',
    validate: userAvatarValidator,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: userEmailValidator,
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: userPasswordValidator,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        throw new NotDataError();
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    });
};

module.exports = mongoose.model('user', userSchema);
