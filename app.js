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
    // email: Joi.string().required().pattern(EmailRegExp),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }), // В main удалить все связи
    password: Joi.string().min(2).required(),
  }),
}), createUser);
/* У вас реализован централизованный обработчик ошибок, который отправляет ответ об ошибки клиенту,
с этого момента в контроллерах, в случае ошибки создаётся объект ошибки и передаётся в next */
/* Удалил */
// app.use((req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });
app.use(errors());

/* Лучше вынести в отдельный модуль */

// app.use((err, req, res, next) => {
//   if (err.statusCode) {
//     res.status(err.statusCode).send({ message: err.message });
//   }
//   // console.error(err.stack);/* Все отладочные строки нужно убирать */
//   res.status(500).send({ message:
// 'Что-то пошло не так(сообщение центрального обработчика ошибок)' });
//   next();
// });
app.use(errorPage, errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`);
});
