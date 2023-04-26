const router = require('express').Router();
const auth = require('../middlewares/auth');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const NOT_FOUND_ERROR_CODE = 404;

const notFoundRouter = (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 - Страница не найдена' });
};

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('/*', notFoundRouter);

module.exports = router;
