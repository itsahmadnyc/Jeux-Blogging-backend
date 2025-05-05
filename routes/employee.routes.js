const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkEmployee = require('../middlewares/employee/checkEmployee');
const checkRole = require("../middlewares/checkRole")

const { createBlog, updateEmployeeBlog, empDeleteOwnBlog, employeeStats } = require('../controllers/employee.controller');







// router.post('/create-blog', authMiddleware, checkRole("employee"), createBlog);
















module.exports = router;