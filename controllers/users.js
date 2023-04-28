const bcrypt = require('bcryptjs');
const User = require('../models/user');

// const NotFoundError = require('../utils/errors/not-found');
const BadRequestError = require('../utils/errors/bad-request');
const NotFoundError = require('../utils/errors/not-found');
const IntervalServerError = require('../utils/errors/internal-server-error');
const ConflictError = require('../utils/errors/conflictError');

const NOT_FOUND_ERROR_CODE = 404;
const BAD_REQUEST_ERROR_CODE = 400;

const createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не указаны почта или пароль.');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.status(201).send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные для создания пользователя.'));
          } else {
            next(err);
          }
        })
        .catch(next);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      // console.log(user);
      // if (!user.email) {
      //   res.status(401).send({ message: 'Необходимо авторизоваться' });
      //   return;
      // }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(401)
        .send({ message: err.message });
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 - Несуществующий ID пользователя' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
      }
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const userId = req.user.id;
  console.log(req.user.id);
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
      }
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user.id;

  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
      }
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports = {
  createUsers,
  login,
  getUsers,
  getUserInfo,
  updateUser,
  updateAvatar,
};
