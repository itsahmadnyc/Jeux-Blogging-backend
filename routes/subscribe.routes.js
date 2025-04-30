const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { subscriber } = require('../controllers/newsletterController');
const router = express.Router(); 



router.post('/subscribe', authMiddleware, subscriber);






module.exports = router;