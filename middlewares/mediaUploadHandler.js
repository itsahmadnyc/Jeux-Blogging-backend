

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});


const fileFilter = function (req, file, cb) {
  const allowedExtensions = /jpeg|jpg|png|mp4|mov|avi|mp3|mpeg|wav|pdf|doc|docx|txt|rtf|wmv/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${ext}`));
  }
};

const mediaUploadHandler = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, 
});


module.exports = mediaUploadHandler.single('file');








