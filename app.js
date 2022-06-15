const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes.js');
const { PORT = 3000 } = process.env;
const app = express();


mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use('/', routes)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
