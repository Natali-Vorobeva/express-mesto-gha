const Card = require('../models/card');

const IntervalServerError = require('../utils/errors/internal-server-error');
const ForbiddenError = require('../utils/errors/forbidden');
const NotFoundError = require('../utils/errors/not-found');

const NOT_FOUND_ERROR_CODE = 404;
const BAD_REQUEST_ERROR_CODE = 400;
const FORBIDDEN_ERROR = 403;

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

const createCards = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: ownerId,
  })
    .then((newCard) => {
      if (!newCard) {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: '400 — Переданы некорректные данные.' });
        return;
      }
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Некорректный запрос' });
      }
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params.cardId;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка не найдена.'))
    // .then((cardId) => {
    //   if (!cardId) {
    //     next(new ForbiddenError('!!!Нельзя удалять чужие карточки.'));
    //   }
    //   if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
    // })
    // .then((card) => {
    //   card.remove();
    //   res.status(200).send({ message: 'Карточка удалена.' });
    // })
    // .catch((err) => {
    //   if (err.message === 'Карточка не найдена');
    //   res.status(FORBIDDEN_ERROR).send({ message: 'Нельзя удалять чужие карточки!!!' });
    // })
    // .catch(next);
    .then((card) => {
      if (card.owner !== req.user._id) {
        return next(new ForbiddenError('Нельзя удалять чужие карточки.'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена');
      res.status(FORBIDDEN_ERROR).send({ message: 'Нельзя удалять чужие карточки' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    // .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка запроса не найдена' });
      }
      res.status(200).send({ data: card });
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

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка запроса не найдена. Некорректный ID' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Некорректный запрос' });
      }
    })
    .catch(() => {
      throw new IntervalServerError('Ошибка сервера');
    })
    .catch(next);
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  deleteLike,
};
