// routes/ cards
const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  delLikeCard,
} = require("../controllers/cards");

 //возвращает все карточки
router.get("/cards", getCards);

//создаёт карточку
router.post("/cards", createCard);

//удаляет карточку по идентификатору
router.delete("/cards/:cardId", deleteCard);

//поставить лайк карточке
router.put("/cards/:cardId/likes", addLikeCard);

//убрать лайк с карточки
router.delete("/cards/:cardId/likes", delLikeCard);

module.exports = router;
