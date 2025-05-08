const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mediaUploadHandler = require("../middlewares/mediaUploadHandler")
const checkRole = require("../middlewares/checkRole");

const { createBlog, empGetBlogById, empPublishedBlogs, empDraftBlogs, employeeStatus, updateEmployeeBlog, empDeleteOwnBlog } = require("../controllers/employee.controller");
const { authPlugins } = require('mysql2');







router.post('/create-blog', authMiddleware, checkRole("employee"), mediaUploadHandler, createBlog);
router.put('/update-blog/:id', authMiddleware, mediaUploadHandler, updateEmployeeBlog);

// router.get('/employee/:id', authMiddleware, getEmpByIdWithDetails);


router.get('/blog/:id',authMiddleware, empGetBlogById);



router.use(authMiddleware, checkRole("employee"));

// router.get('/blog/:id', empGetBlogById);
router.get('/publish-blogs', empPublishedBlogs);
router.get('/draft-blogs', empDraftBlogs);
router.get('/employee-status', employeeStatus);
router.delete('/blog/:blogId', empDeleteOwnBlog);




module.exports = router;


