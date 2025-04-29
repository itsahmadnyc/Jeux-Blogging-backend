const APP_BASE_URL = process.env.BASE_URL;

exports.uploadMedia = (req, res) => {
  const files = req.files;
  const userId = req.user?.id;

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Pick the first file from any field (image, audio, etc.)
  let uploadedFile;
  for (const field in files) {
    if (files[field] && files[field][0]) {
      uploadedFile = files[field][0];
      break;
    }
  }

  if (!uploadedFile) {
    return res.status(400).json({ message: 'No valid file uploaded.' });
  }

  const fileUrl = `${APP_BASE_URL}/uploads/${uploadedFile.filename}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    userId,
    fileUrl
  });
};
























// const response = require("../utils/responseHandler");
// exports.uploadMedia = (req, res) => {
//     const userId = req.user.id;
//     if (!userId) {
//         return response.notFound("Token is invalid or missing..!")
//     }
//     const files = req.files;

//     if (!files || Object.keys(files).length === 0) {
//         return res.status(400).json({ message: 'No files uploaded.' });
//     }

//     const APP_BASE_URL = process.env.BASE_URL
//     const uploadedFiles = {};

//     for (const field in files) {
//         uploadedFiles[field] = files[field].map(file => ({

//             fileUrl: `${APP_BASE_URL}/uploads/${file.filename}`
//         }));
//     }

//     res.status(200).json({
//         message: 'Files uploaded successfully',
//         userId,
//         files: uploadedFiles
//     });
// };
