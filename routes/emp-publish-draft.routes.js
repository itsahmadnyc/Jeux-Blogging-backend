const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require("../middlewares/checkRole");

const {createBlog, empPublishedBlogs, empDraftBlogs,updateEmployeeBlog, employeeStats, empDeleteOwnBlog} = require("../controllers/employee.controller")






router.post('/create-blog', authMiddleware, checkRole("employee"), createBlog);
router.get('/publish-blogs', authMiddleware, checkRole("employee"), empPublishedBlogs);
router.get('/draft-blogs', authMiddleware, checkRole("employee"), empDraftBlogs);
router.get('/employee-status/:id', authMiddleware, checkRole("employee"), employeeStats);
router.put('/update-blog/:id', authMiddleware, checkRole("employee"), updateEmployeeBlog);
router.delete('/blog/:blogId', authMiddleware, checkRole("employee"), empDeleteOwnBlog);







module.exports = router;