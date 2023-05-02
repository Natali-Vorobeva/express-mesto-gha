const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes');

const NOT_FOUND_ERROR_CODE = 404;
const BAD_REQUEST_ERROR_CODE = 400;

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 — Не найдено' });
    return;
  }
  if (err.name === 'ValidationError ') {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные' });
    return;
  }
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
