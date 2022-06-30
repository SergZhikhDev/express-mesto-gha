const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routesUser = require('./routes/users');
const routesCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', isAuthorized, routesUser);
app.use('/cards', isAuthorized, routesCard);
app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(300),
    email: Joi.string().min(2).max(30).required(),
    password: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.use((req, res) => {
  res.status(400).send({ message: 'Страница не найдена' });
});
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }

  console.error(err.stack);

  res.status(500).send({ message: 'Что-то пошло не так(сообщение центрального обработчика ошибок)' });
  next();
});

app.listen(PORT, () => {
  console.log('App listening on port PORT / Приложение запущено, используется порт PORT.');
});
