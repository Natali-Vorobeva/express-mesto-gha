const mongoose = require('mongoose');
require('mongoose-type-url');

const { imgUrlRegExp } = require('../utils/regexp');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true,
    validate: {
      validator: (link) => imgUrlRegExp.test(link),
      message: 'Неверный URL изображения.',
    },
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
