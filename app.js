const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const notFoundRouter = require('./utils/errors/notFoundRouter');
const { createUsers, login } = require('./controllers/users');
const { validateUserCreate, validateUserLogin } = require('./middlewares/celebrate');
const auth = require('./middlewares/auth');

const { PORT = 3003 } = process.env;

const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(router);

app.post('/signup', validateUserCreate, createUsers);
app.post('/signin', validateUserLogin, login);

app.use('/users', auth, usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', notFoundRouter);

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
