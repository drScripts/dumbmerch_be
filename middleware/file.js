const multer = require("multer");
const path = require("path");
const { allowedFileSize } = require("../config");

/**
 *
 * @param {string} imageFile image file field in form / request body
 * @param {boolean} required is request should upload the image or not
 * @returns
 */
exports.uploadFile = (imageFile, required = true) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(__dirname, "../public/images/products");
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  // Filter file extension
  const fileFilter = function (req, file, cb) {
    if (file.fieldname == imageFile) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        req.fileValidationError = {
          message: "Please upload the valid image file",
        };
        return cb(new Error("Please upload the valid image file", false));
      }
    }
    cb(null, true);
  };

  const maxSizeMb = parseInt(allowedFileSize) || 2;
  const maxSizeB = maxSizeMb * 1000 * 1000;
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeB,
    },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, (err) => {
      // if filter error
      if (req.fileValidationError)
        return res.status(400).json({
          status: "error",
          message: req.fileValidationError.message,
        });

      if (required) {
        if (!req.file && !err)
          return res.status(400).json({
            status: "error",
            message: "Please upload file image",
          });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE")
          return res.status(400).json({
            status: "error",
            message: `File image max size is ${maxSizeMb} MB!`,
          });

        return res.status(400).json({
          stats: "error",
          message: err.message,
        });
      }

      next();
    });
  };
};
