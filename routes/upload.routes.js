const express = require('express');
const router = express.Router();
const {getAllMediaFiles, uploadMedia, uploadMediaWithTitle, deleteMediaFile} = require('../controllers/uploadController');
const mediaUploadHandler = require("../middlewares/mediaUploadHandler");
const authMiddleware = require('../middlewares/auth.middleware');





router.get('/', getAllMediaFiles);

router.post('/upload', authMiddleware, mediaUploadHandler, uploadMedia);

router.post('/media-upload',authMiddleware,  mediaUploadHandler,uploadMediaWithTitle); 

router.delete('/media-delete/:id', authMiddleware, deleteMediaFile);




module.exports = router;