const User = require('../models/user');

const ErrorBadRequest = require('../errors/bad-request');
const ErrorNotFound = require('../errors/not-found');

const createUsers = (req, res) => {

  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!req.body.avatar) {
        res.status(400).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
      }
      if (!req.body.name || !req.body.about) {
        res.status(400).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
        console.log(res.status);
        return;
      }
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(400).send(err);
    })
}

const getUserInfo = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: '404 - Несуществующий ID пользователя' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err) {
        res.status(400).send({ message: '400 — Некорректный ID пользователя' });
        return;
      }
      res.status(404).send(err);
    })
}

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: '404 — Не найдено' });
        return;
      }
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Отправлены некорректные данные'));
        return;
      }
    })
};

const updateUser = (req, res) => {
  const userId = req.user.id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true
    }
  )
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: `Пользователь с ID ${userId} не найден` });
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(400).send(error);
    })
};

const updateAvatar = (req, res, next) => {
  const userId = req.user.id;

  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true
    }
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(`Пользователь с ID ${userId} не найден`);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Отправлены некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректный ID пользователя'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createUsers,
  getUsers,
  getUserInfo,
  updateUser,
  updateAvatar
}