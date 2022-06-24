const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    // вернём записанные в базу данные
    .then((card) => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId) // app.use('/users', require('./routes/users'));
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } })// $ push
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.delLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
