const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      throw err;
    })
    .catch(next);
};

const createCards = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner
  })
    .then((newCard) => {
      if (!req.body.name || !req.body.link) {
        res.status(400).send({ message: '400 — Переданы некорректные данные.' });
        return;
      }
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверные данные, переданные при создании пользователя' });
        return;
      }
    })
};

const getCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .then((newCard) => {
      res.send(newCard)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
}

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card.owner !== req.user._id) {
        res.status(404).send({ message: 'Вы не можете удалить чужую карточку' });
        return;
      }
      if (!card) {
        res.status(404).send({ message: 'Карточка запроса не найдена' });
        return;
      }

      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: '400 — Переданы некорректные данные _id для удаления карточки.' });
        return;
      }
      res.status(404).send({ message: 'Карточка запроса не найдена' });
    })
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка запроса не найдена' });
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка запроса не найдена' });
        return;
      }
      next(err);
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка запроса не найдена. Некорректный ID' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID' });
        return;
      }
      res.status(400).send({ message: 'Некорректный ID' });
    });
};

module.exports = {
  createCards,
  getCards,
  getCard,
  deleteCard,
  likeCard,
  deleteLike
}