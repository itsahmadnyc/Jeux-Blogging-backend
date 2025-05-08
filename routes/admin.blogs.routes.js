const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {adminReadAllBlogs, getCommentsByBlog, deleteBlogComments, globalGetBlogById} = require('../controllers/admin.blogs.controller');
const checkAdmin = require('../middlewares/admin/checkAdmin');






router.get('/all-blogs', authMiddleware, adminReadAllBlogs);
router.get('/comments/:blogId', authMiddleware, checkAdmin, getCommentsByBlog);
router.delete('/delete/:blogId', authMiddleware, checkAdmin, deleteBlogComments);

router.get('/global-blog/:id', authMiddleware, globalGetBlogById)



module.exports = router;