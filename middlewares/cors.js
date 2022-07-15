const allowedCors = ['https://back-szh.students.nomorepartiesxyz.ru',
  'http://back-szh.students.nomorepartiesxyz.ru',
  'https://front-szh.students.nomorepartiesxyz.ru',
  'http://front-szh.students.nomorepartiesxyz.ru',
  'localhost:3000',
];
module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};
