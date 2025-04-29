const express = require('express');
const router = express.Router();
const {uploadMedia} = require('../controllers/uploadController');
const mediaUploadHandler = require("../middlewares/mediaUploadHandler");
const authMiddleware = require('../middlewares/auth.middleware');





router.post('/upload', authMiddleware, mediaUploadHandler.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), uploadMedia);





module.exports = router;