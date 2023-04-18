const mongoose = require('mongoose');
require('mongoose-type-url');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жанна Куст',
  },
  about: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь Mongoose',
  },
  avatar: {
    type: mongoose.Schema.Types.Url,
    default: 'https://avatars.mds.yandex.net/i?id=2a00000179f7e69ac338df215520d533d241-4120780-images-thumbs&n=13',
    require: true,
  },
});

module.exports = mongoose.model('user', userSchema);