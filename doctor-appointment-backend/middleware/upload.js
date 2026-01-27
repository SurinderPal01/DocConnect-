const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "doctor-chat",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5Mb
});

module.exports = upload;
