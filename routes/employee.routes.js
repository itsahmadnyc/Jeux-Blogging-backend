const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkEmployee = require('../middlewares/employee/checkEmployee');
const checkRole = require("../middlewares/checkRole")

const { createBlog, updateEmployeeBlog, empDeleteOwnBlog, employeeStats } = require('../controllers/employee.controller');







router.post('/create-blog', authMiddleware, checkRole("employee"), createBlog);


// router.get('/published-blogs', authMiddleware, checkRole("employee"), employeePublishedBlogs);
// router.get('/draft-blogs', authMiddleware, checkRole("employee"), employeeDraftBlogs);


router.put('/update-blog/:id', authMiddleware, checkRole("employee"), updateEmployeeBlog);
router.delete('/blog/:blogId', authMiddleware, checkRole("employee"), empDeleteOwnBlog);
router.get('/employee-status/:id', authMiddleware, checkRole("employee"), employeeStats);











module.exports = router;