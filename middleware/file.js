const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, "../public/images/products");
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const isFileExt = file.originalname.match(/\.(png|jpg|jpeg|gif|webp)$/i);
    if (!isFileExt) return cb(new Error("Invlid image type"), null);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2097152,
  },
}).single("image");

const handler = (req, res, next) => {
  console.log(req.file);
  if (!req.file)
    return res.status(400).json({
      status: "error",
      message: "Please upload product image",
    });

  next();
};

module.exports = { upload, handler };
