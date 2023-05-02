const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const notFoundRouter = require('./controllers/notFoundRouter');
const { createUsers, login } = require('./controllers/users');
const { validateUserCreate, validateUserLogin } = require('./middlewares/celebrate');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', validateUserCreate, createUsers);
app.post('/signin', validateUserLogin, login);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('/*', notFoundRouter);

const NOT_FOUND_ERROR_CODE = 404;
const BAD_REQUEST_ERROR_CODE = 400;
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'CastError') {
    res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 — Не найдено' });
    return;
  }
  if (err.name === 'ValidationError ') {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные' });
    return;
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? '500 - На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
