// можо удалить комментарий
const router = require("express").Router();

const Card = require("../models/card");
// console.log(Card)





//возвращает все карточки
router.get("/cards", (req, res) => {
  Card.find({})

    .then((card ) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});


//создаёт карточку
// router.post('/users', createUser);

router.post("/cards", (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link})
    // вернём записанные в базу данные
    .then((card) => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});



//удаляет карточку по идентификатору
router.delete("/cards/:cardId", (req, res) => {
  // res.send(req.params);



  Card.findByIdAndRemove(req.params.cardId)  // app.use('/users', require('./routes/users'));
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
});

module.exports = router;

