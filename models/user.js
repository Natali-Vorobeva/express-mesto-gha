const mongoose = require('mongoose');
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
    type: mongoose.Schema.Types.Url,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
