const cardsRouter = require('express').Router();

const { createCards, getCard, getCards, deleteCard, likeCard, deleteLike } = require('../controllers/cards');

cardsRouter.post('/', createCards);
cardsRouter.get('/', getCards);
cardsRouter.get('/:cardId', getCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;