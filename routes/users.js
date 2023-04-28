const usersRouter = require('express').Router();
const {
  getUser, getUsers, getUserInfo, updateUser, updateAvatar,
} = require('../controllers/users');
const { validateUserId, validateUserUpdate, validateUserAvatar } = require('../middlewares/celebrate');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:id', validateUserId, getUserInfo);
usersRouter.patch('/me', validateUserUpdate, updateUser);
usersRouter.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = usersRouter;
