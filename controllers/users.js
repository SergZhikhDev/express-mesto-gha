//controllers/user

const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user)) //как вариант
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createUser = (req, res) => {
  // del  // const { name, about, avatar } = req.body;
  User.create(req.body)
    .then((user) => res.send({ data: user })) // вернём записанные в базу данные
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" })); // данные не записались, вернём ошибку
};

module.exports.updateProfile = (req, res) => {
  // del // console.log(req.user._id);
  // del// const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, req.body)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
