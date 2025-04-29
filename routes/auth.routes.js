const express = require('express');
const router = express.Router(); 
const passport = require('passport'); 
const jwt = require('jsonwebtoken');
const { register, login, getProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/register', register);
router.post('/login',authMiddleware, login);





router.get('/profile', authMiddleware, getProfile); 

module.exports = router;
