const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const restrictor = require('../middlewares/restrictor');

router.post('/signup', userCtrl.signup, userCtrl.login);
router.post('/login', userCtrl.login);
router.get('/user', restrictor, userCtrl.user);
router.get('/users', restrictor, userCtrl.users);

module.exports = router;
