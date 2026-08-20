const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const createUploader = (folderName) => {

  // =====================================================
  // UPLOAD PATH
  // =====================================================

  const uploadPath = path.join(
    __dirname,
    "../uploads",
    folderName
  );

  // =====================================================
  // CREATE FOLDER
  // =====================================================

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  // =====================================================
  // STORAGE
  // =====================================================

  const storage = multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

      const uniqueName =
        uuidv4() +
        path.extname(file.originalname);

      cb(null, uniqueName);
    },

  });

  // =====================================================
  // FILE FILTER
  // =====================================================

  const fileFilter = (req, file, cb) => {

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only JPG, JPEG and PNG files are allowed."
        )
      );

    }
  };

  // =====================================================
  // MULTER
  // =====================================================

  return multer({
    storage,
    fileFilter,
  });
};

module.exports = createUploader;