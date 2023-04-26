const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('mongoose-type-url');

const userSchema = new mongoose.Schema({
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
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
