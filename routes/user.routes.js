const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdmin = require('../middlewares/admin/checkAdmin');
const { addEmployee, getAllEmployees, deleteEmployee, updateEmployee, getEmployeeById, getAllUsers, deleteUser } = require('../controllers/user.controller');
const { profileImage } = require('../middlewares/upload');


const { updateProfileImage, contactUs, userGetAllBlogs, likeOrDislikeBlog, addCommentsOrReply, userDeleteAccount } = require('../controllers/user.controller');






// // Admin Section Routes
router.post('/add-employee', authMiddleware, checkAdmin, profileImage, addEmployee);
router.get('/all-employees', authMiddleware, checkAdmin, getAllEmployees);
router.delete('/delete-employee/:id', authMiddleware, checkAdmin, deleteEmployee);
router.put('/update-employee/:id', authMiddleware, checkAdmin, profileImage, updateEmployee);
router.get('/employee/:id', authMiddleware, checkAdmin, getEmployeeById);


router.get('/all-users', authMiddleware, checkAdmin, getAllUsers);
router.delete('/delete-user/:id', authMiddleware, checkAdmin, deleteUser);



//USER SECTION
router.put('/updateProfileImage', authMiddleware, profileImage, updateProfileImage);
router.post('/contact', contactUs);

router.get('/userAllBlogs', userGetAllBlogs);
router.delete('/delete', authMiddleware, userDeleteAccount);
router.post('/comment/:blogId', authMiddleware, addCommentsOrReply);


router.post('/like-dislike/:blogId', authMiddleware, likeOrDislikeBlog);







module.exports = router;


