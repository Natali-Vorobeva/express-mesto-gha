const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const BAD_REQUEST_ERROR_CODE = 400;

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use(cors());

app.use(requestLogger);
app.use(helmet());
app.use(errorLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError ') {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные' });
    return;
  }
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка!!'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
