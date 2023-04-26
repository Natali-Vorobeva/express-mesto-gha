const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');

const { PORT = 3003 } = process.env;

const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
