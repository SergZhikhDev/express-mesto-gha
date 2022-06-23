const router = require("express").Router();

const User = require("../models/user");



const {
  getUser,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');


//возвращает всех пользователей
router.get("/users", (req, res) => {
  // const { users } = req.params;
  // res.send(users);

  User.find({})
    // .then((user) => res.send({ data: user }))
    .then((user) => res.status(200).send(user))//как вариант
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});

//возвращает пользователя по _id
router.get("/users/:id", (req, res) => {
  // res.send(req.params);
  User.findById(req.params.userid)  // app.use('/users', require('./routes/users'));
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});

//создаёт пользователя
router.post('/users', createUser);


// router.post("/users", (req, res) => {

//   console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqq', res.body)
//   const { name, about, avatar } = req.body;


//   User.create({ name, about, avatar })
//     // вернём записанные в базу данные
//     .then((user) => res.send({ data: user }))
//     // данные не записались, вернём ошибку
//     .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
// });

module.exports = router;



