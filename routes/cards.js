const cardsRouter = require('express').Router();

const {
  createCards, getCards, deleteCard, likeCard, deleteLike,
} = require('../controllers/cards');
const { validateCardPost, validateCardId } = require('../middlewares/celebrate');

cardsRouter.post('/', validateCardPost, createCards);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', validateCardId, deleteCard);
cardsRouter.put('/:cardId/likes', validateCardId, likeCard);
cardsRouter.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = cardsRouter;
