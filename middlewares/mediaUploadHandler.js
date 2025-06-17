

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









// Middleware each file store in seprate file
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const baseUploadDir = path.join(__dirname, '../uploads');

// // Ensure directory exists
// const ensureDirExists = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Media upload in Folders
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();
//     let folder = 'others'; // default

//     if (['.jpeg', '.jpg', '.png'].includes(ext)) {
//       folder = 'images';
//     } else if (['.mp4', '.mov', '.avi', '.wmv'].includes(ext)) {
//       folder = 'videos';
//     } else if (['.mp3', '.mpeg', '.wav'].includes(ext)) {
//       folder = 'audio';
//     }  else if (['.doc', '.pdf', '.docx', 'txt'].includes(ext)) {
//       folder = 'documents';
//     } 

//     const uploadPath = path.join(baseUploadDir, folder);
//     ensureDirExists(uploadPath);
//     cb(null, uploadPath);
//   },


//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'file-' + uniqueSuffix + ext);
//   }
// });

// const fileFilter = function (req, file, cb) {
//   const allowedExtensions = /jpeg|jpg|png|mp4|mov|avi|mp3|mpeg|wav|pdf|doc|docx|txt|rtf|json|wmv/;
//   const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

//   if (allowedExtensions.test(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Invalid file type: ${ext}`));
//   }
// };

// const mediaUploadHandler = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 },
// });

// module.exports = mediaUploadHandler.single('file');

