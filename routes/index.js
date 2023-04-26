const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const login = require('./users');
const createUser = require('./users');

const NOT_FOUND_ERROR_CODE = 404;

const notFoundRouter = (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 - Страница не найдена' });
};

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8).max(8),
  }).unknown(true),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8).max(8),
  }).unknown(true),
}), createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('/*', notFoundRouter);

module.exports = router;
