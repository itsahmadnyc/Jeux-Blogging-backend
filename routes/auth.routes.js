const express = require('express');
const router = express.Router(); 
const passport = require('passport'); 
const { register, login, getProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/register', register);
router.post('/login',authMiddleware, login);





// ROUTE TO INITIATE GOOGLE AUTHENTICATION
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));


// CALLBACK FROM GOOGLE
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // REDIRECT TO FRONTEND DASHBOARD PAGE ETC
      res.send(`Welcome ${req.user.name}, you have successfully logged in!`);
    }
  );

router.get('/profile', authMiddleware, getProfile); 

module.exports = router;
