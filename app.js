const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routesUser = require('./routes/users');
const routesCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');
const { errorPage, errorHandler } = require('./middlewares/error-handler');

const { LinksRegExp, EmailRegExp } = require('./utils/all-reg-exp');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', isAuthorized, routesUser);
app.use('/cards', isAuthorized, routesCard);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EmailRegExp),
    password: Joi.string().min(2).max(30).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(LinksRegExp),
    email: Joi.string().required().pattern(EmailRegExp),
    password: Joi.string().min(2).required(),
  }),
}), createUser);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.use(errors());

app.use(errorPage, errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`);
});
