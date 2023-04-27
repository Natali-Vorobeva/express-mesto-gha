const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const IntervalServerError = require('../utils/errors/internal-server-error');

require('mongoose-type-url');

const { imgUrlRegExp } = require('../utils/regexp');
const UnauthorizedError = require('../utils/errors/unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Указана неверная почта.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жанна Куст',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь Mongoose',
  },
  avatar: {
    type: mongoose.Schema.Types.Url,
    default: 'https://yt3.ggpht.com/ytc/AKedOLTcTak9LjKu1XvPyVBX2ooAAkNrkcm3ja-hCcBp=s900-c-k-c0x00ffffff-no-rj',
    validate: {
      validator: (avatar) => imgUrlRegExp.test(avatar),
      message: 'Неверный url изображения.',
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль.');
          }

          return user;
        })
        .catch(() => {
          throw new IntervalServerError('Ошибка сервера');
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
