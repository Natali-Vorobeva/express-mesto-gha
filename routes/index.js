const router = require('express').Router();

const { createUsers, login } = require('../controllers/users');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const notFoundController = require('../controllers/notFoundController');

const auth = require('../middlewares/auth');
const { validateUserCreate, validateUserLogin } = require('../middlewares/celebrate');

router.post('/signup', validateUserCreate, createUsers);
router.post('/signin', validateUserLogin, login);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('/*', auth, notFoundController);

module.exports = router;
