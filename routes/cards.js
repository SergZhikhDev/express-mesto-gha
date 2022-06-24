const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  delLikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", addLikeCard);
router.delete("/cards/:cardId/likes", delLikeCard);

module.exports = router;
