const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {adminReadAllBlogs, getCommentsByBlog} = require('../controllers/admin.blogs.controller');






router.get('/all-blogs', authMiddleware, adminReadAllBlogs);
router.get('/comments/:blogId', authMiddleware, getCommentsByBlog);



module.exports = router;