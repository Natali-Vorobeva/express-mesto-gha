const Card = require('../models/card');

const ForbiddenError = require('../utils/errors/forbidden');
const NotFoundError = require('../utils/errors/not-found');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

async function createCards(req, res, next) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    next(err);
  }
}

// async function deleteCard(req, res, next) {
//   try {
//     const { cardId } = req.params;

//     const card = await Card.findById(cardId).populate('owner');

//     if (!card) {
//       throw new NotFoundError('');
//     }
//     const ownerId = card.owner.id;
//     const userId = req.user._id;

//     if (ownerId !== userId) {
//       throw new ForbiddenError('Нельзя удалить чужую карточку');
//     }

//     if (!cardId) {
//       throw new NotFoundError('Карточка не найдена');
//     }

//     await Card.deleteOne(card);

//     res.send(card);
//   } catch (err) {
//     next(err);
//   }
// }

const deleteCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка не найдена.'))
    .then((card) => {
      if (card.owner.toString() !== owner) {
        throw new ForbiddenError('Отсутствие прав на удаление карточки.');
      }

      // уже можно удалить карточку
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((delCard) => {
      res.send(delCard);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new NotFoundError('Некорректный формат id.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Не найдено.'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Не найдено.'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  deleteLike,
};
