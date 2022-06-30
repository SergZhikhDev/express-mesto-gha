/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routesUser = require('./routes/users');
// const adminsRouter = require('./routes/admins');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');
const routesCard = require('./routes/cards');
const { NOT_FOUND_CODE } = require('./utils/errorcodes');

const { PORT = 3000 } = process.env;
const app = express();
// const addObjUser = (req, res, next) => {
//   req.user = {
//     _id: '62b429f633896d7009353a22',
//   };

//   next();
// };

// mongoose.connect('mongodb://localhost:27017/mestodb'); Так у меня не работает
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(isAuthorized);

app.use('/users', isAuthorized, routesUser);
app.use('/cards', isAuthorized, routesCard);
// app.use('/', adminsRouter);
app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Страница не найдена' });
});
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.error(err.stack);

  res.status(500).send({ message: 'Что-то пошло не так(сообщение центрального обработчика ошибок)' });
});

app.listen(PORT, () => {
  console.log('App listening on port PORT / Приложение запущено, используется порт PORT.');
});
