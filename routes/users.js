const usersRouter = require('express').Router();
const {
  getUsers, getUserInfo, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserInfo);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
