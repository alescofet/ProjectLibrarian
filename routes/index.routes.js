const express = require('express');
const router  = express.Router();

/* GET Home page */
router.get('/', (req, res, next) => {
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
  res.status(202).render('index' ,{layout: layout});
});


module.exports = router;