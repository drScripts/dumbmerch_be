const router = require("express").Router();
const {
  list,
  show,
  add,
  update,
  deleteData,
  all,
} = require("../controllers/product");
const { adminMiddleware, fileUpload } = require("../middleware");

router.get("/products", list);
router.get("/products/all", all);
router.get("/product/:id", show);

router.post("/product", [adminMiddleware, fileUpload("image")], add);
router.patch(
  "/product/:id",
  [adminMiddleware, fileUpload("image", "products", false)],
  update
);
router.delete("/product/:id", adminMiddleware, deleteData);
module.exports = router;
