const response = require("../utils/responseHandler");
const APP_BASE_URL = process.env.BASE_URL;

exports.uploadMedia = (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return response.notFound(res, 'Tokin is invalid or missing');
  }
  const uploadedFile = req.file;

  console.log("Console.log uploaded file:", uploadedFile);
  if (!uploadedFile) {
    return response.notFound(res, "No file uploaded.");
  }

  const fileUrl = `${APP_BASE_URL}/uploads/${uploadedFile.filename}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    userId,
    fileUrl
  });
};



