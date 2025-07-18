const express = require('express');
const router = express.Router();
const {addCategory, getAllCategories, deleteCategory, updateCategory, getCategoryById} = require("../controllers/category.controller");
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdmin = require('../middlewares/admin/checkAdmin');


router.post('/add-category', authMiddleware, checkAdmin, addCategory);
router.get('/all-categories',  getAllCategories);
router.put('/update-category/:id', authMiddleware, updateCategory);
router.delete('/delete-category/:id', authMiddleware, deleteCategory);
router.get('/:id', authMiddleware, checkAdmin, getCategoryById);





module.exports = router;