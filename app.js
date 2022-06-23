const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/users");
const { PORT = 3000 } = process.env;
const app = express();


// mongoose.connect('mongodb://localhost:27017/mestodb'); Так у меня не работает
mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`
  );
});
