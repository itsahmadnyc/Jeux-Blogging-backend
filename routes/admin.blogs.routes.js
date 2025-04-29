const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {adminReadAllBlogs} = require('../controllers/admin.blogs.controller');






router.get('/all-blogs', authMiddleware, adminReadAllBlogs);



module.exports = router;