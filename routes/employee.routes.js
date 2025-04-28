const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkEmployee = require('../middlewares/employee/checkEmployee');

const { createBlog, employeePublishedBlogs, employeeDraftBlogs, updateEmployeeBlog, empDeleteOwnBlog, employeeStats } = require('../controllers/employee.controller');







router.post('/create-blog', authMiddleware, checkEmployee, createBlog);
router.get('/published-blogs', authMiddleware, employeePublishedBlogs);
router.get('/draft-blogs', authMiddleware, employeeDraftBlogs);
router.put('/update-blog/:id', authMiddleware, checkEmployee, updateEmployeeBlog);
router.delete('/blog/:blogId', authMiddleware,  empDeleteOwnBlog);
router.get('/employee-status/:id', authMiddleware, checkEmployee, employeeStats);








module.exports = router;