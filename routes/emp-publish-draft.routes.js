const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require("../middlewares/checkRole");

const { createBlog, empPublishedBlogs, empDraftBlogs, updateEmployeeBlog, employeeStatus, empDeleteOwnBlog } = require("../controllers/employee.controller")





router.use(authMiddleware, checkRole("employee"));


router.post('/create-blog',  createBlog);
router.get('/publish-blogs', empPublishedBlogs);
router.get('/draft-blogs', empDraftBlogs);
router.get('/employee-status', employeeStatus);
router.put('/update-blog/:id', updateEmployeeBlog);
router.delete('/blog/:blogId', empDeleteOwnBlog);




module.exports = router;


