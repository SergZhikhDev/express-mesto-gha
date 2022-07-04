const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const NotDataError = require('../utils/errorcodes/not-pass-or-email');
const { LinksRegExp } = require('../utils/all-reg-exp');

const {
  userNameValidator,
  userAboutValidator,
  userEmailValidator,
  userPasswordValidator,
} = require('../validators/validators');

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
    validate: {
      validator(v) {
        return LinksRegExp.test(v);
      },
      message: (props) => `${props.value} is not a valid URL-link!/${props.value} Не верный формат URL-ссылки!!`,
    },
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
        throw new NotDataError();
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    });
};

module.exports = mongoose.model('user', userSchema);
