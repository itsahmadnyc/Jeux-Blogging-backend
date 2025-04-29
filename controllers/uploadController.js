const response = require("../utils/responseHandler");



exports.uploadMedia = (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return response.notFound("Token is invalid or missing..!")
    }
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
    }

    const APP_BASE_URL = process.env.BASE_URL
    const uploadedFiles = {};

    for (const field in files) {
        uploadedFiles[field] = files[field].map(file => ({

            fileUrl: `${APP_BASE_URL}/uploads/${file.filename}`
        }));
    }

    res.status(200).json({
        message: 'Files uploaded successfully',
        userId,
        files: uploadedFiles
    });
};
