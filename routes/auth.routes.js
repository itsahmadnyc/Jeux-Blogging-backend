const express = require('express');
const router = express.Router(); 
const passport = require('passport'); 
const { register, login, getProfile } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/register', register);
router.post('/login', login);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const payload = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.redirect(`http://localhost:3000/google-success?token=${token}`);
  }
);




router.get('/profile', authMiddleware, getProfile); 

module.exports = router;
