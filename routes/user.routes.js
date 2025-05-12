const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdmin = require('../middlewares/admin/checkAdmin');
const { addEmployee, getAllEmployees, deleteEmployee, updateEmployee, getEmployeeById, getAllUsers, deleteUser, getAllContactRequests } = require('../controllers/user.controller');
const { profileImage } = require('../middlewares/upload');


const { updateProfileImage, contactUs, userGetAllBlogs, likeOrDislikeBlog, addCommentsOrReply, userDeleteAccount } = require('../controllers/user.controller');
const optionalAuth = require("../middlewares/optionalAuth")






// Admin Section Routes
router.post('/add-employee', authMiddleware,  profileImage, addEmployee);
router.get('/all-employees', authMiddleware, getAllEmployees);
router.delete('/delete-employee/:id', authMiddleware, deleteEmployee);
router.put('/update-employee/:id', authMiddleware,  profileImage, updateEmployee);
router.get('/employee/:id', authMiddleware,  getEmployeeById);



// Admin Routes for users
router.get('/all-users', authMiddleware, checkAdmin, getAllUsers);
router.delete('/delete-user/:id', authMiddleware, checkAdmin, deleteUser);
router.get('/all-contacts', authMiddleware, getAllContactRequests);



//USER SECTION
router.put('/updateProfileImage', authMiddleware, profileImage, updateProfileImage);
router.post('/contact', contactUs);



router.get('/userAllBlogs', userGetAllBlogs);
router.delete('/delete', authMiddleware, userDeleteAccount);


router.post('/comment/:blogId', optionalAuth, addCommentsOrReply);
router.post('/like-dislike/:blogId', optionalAuth, likeOrDislikeBlog);







module.exports = router;


