// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const imageFilter = function (req, file, cb) {
  const allowedImageTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (file.fieldname === 'profileImage' && allowedImageTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type for profileImage. Only JPEG, JPG, PNG allowed.'));
  }
};

const profileImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
}).single('profileImage'); // Only one profileImage at a time

module.exports = {
  profileImage
};







