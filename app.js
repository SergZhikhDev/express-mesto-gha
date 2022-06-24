const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routesUser = require("./routes/users");
const routesCard = require("./routes/cards");
const { PORT = 3000 } = process.env;
const app = express();
const addObjUser =(req, res, next) => {
  req.user = {
    _id: '62b425f3597ead12a78ac207',
  };

  next();
}

// mongoose.connect('mongodb://localhost:27017/mestodb'); Так у меня не работает
mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(addObjUser);
app.use("/", routesUser);
app.use("/", routesCard);










app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`
  );
});
