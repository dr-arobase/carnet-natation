const express = require('express');
const router = express.Router();

router.use('/nageurs', require('./nageurs.routes'));
// router.use('/users', require('./users.routes'));
// router.use('/auth', require('./auth.routes'));

module.exports = router;
