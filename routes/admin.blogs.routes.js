const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {globalReadAllBlogs, getCommentsByBlog, deleteBlogComments, globalBlogDetailsById, getTop5PopularBlogs} = require('../controllers/admin.blogs.controller');
const checkAdmin = require('../middlewares/admin/checkAdmin');






router.get('/all-blogs', globalReadAllBlogs);

// router.get('/top-post', getTop5PopularBlogs);

router.get('/comments/:blogId', authMiddleware, checkAdmin, getCommentsByBlog);
router.delete('/delete/:blogId', authMiddleware, checkAdmin, deleteBlogComments);

router.get('/global-blog/:id', globalBlogDetailsById);





module.exports = router;