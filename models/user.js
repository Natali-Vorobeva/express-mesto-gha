const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

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
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь планеты',
  },
  avatar: {
    type: mongoose.Schema.Types.Url,
    default: 'https://yt3.ggpht.com/ytc/AKedOLTcTak9LjKu1XvPyVBX2ooAAkNrkcm3ja-hCcBp=s900-c-k-c0x00ffffff-no-rj',
    validate: {
      validator: (avatar) => imgUrlRegExp.test(avatar),
      message: 'Неверный URL изображения.',
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')

    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
