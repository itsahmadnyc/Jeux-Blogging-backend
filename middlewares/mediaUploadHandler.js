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
  limits: { fileSize: 50 * 1024 * 1024 }, 
});


module.exports = mediaUploadHandler.single('file');


































 // middleware for upload audio, vedio, pdf and image with field name audio, vedio, document and image respectively;

// // middleware/mediaUploadHandler.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// const fileFilter = function (req, file, cb) {
//   const allowedTypes = {
//     image: /jpeg|jpg|png/,
//     video: /mp4|mov|avi/,
//     audio: /mp3|mpeg|wav/,
//     document: /pdf|doc|docx|txt/
//   };

//   const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  
//   const typeMatch =
//     (file.fieldname === 'image' && allowedTypes.image.test(ext)) ||
//     (file.fieldname === 'video' && allowedTypes.video.test(ext)) ||
//     (file.fieldname === 'audio' && allowedTypes.audio.test(ext)) ||
//     (file.fieldname === 'document' && allowedTypes.document.test(ext));

//   if (typeMatch) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Invalid file type for ${file.fieldname}`));
//   }
// };

// const mediaUploadHandler = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 }, 
// });

// module.exports = mediaUploadHandler;
