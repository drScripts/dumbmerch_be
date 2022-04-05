const router = require("express").Router();
const {
  list,
  show,
  add,
  update,
  deleteData,
  all,
} = require("../controllers/product");
const multer = require("multer");
const path = require("path");
const { adminMiddleware } = require("../middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, "../public/images/products");
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/products", list);
router.get("/products/all", all);
router.get("/product/:id", show);

router.use(adminMiddleware);
router.post("/product", upload.single("image"), add);
router.patch("/product/:id", upload.single("image"), update);
router.delete("/product/:id", deleteData);
module.exports = router;
