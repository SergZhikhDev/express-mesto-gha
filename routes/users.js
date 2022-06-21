const router = require('express').Router();

router.get('/users', (req, res) => {
  const { users } = req.params;
   res.send(users)
});

router.get('/users/:id', (req, res) => {
  res.send(req.params);

    }); 

module.exports = router; // экспортировали роутер