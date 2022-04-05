const router = require("express").Router();
const {
  list,
  add,
  update,
  show,
  deleteData,
} = require("../controllers/categories");
const { adminMiddleware } = require("../middleware");

router.get("/categories", list);
router.get("/category/:id", show);

router.post("/category", adminMiddleware, add);
router.patch("/category/:id", adminMiddleware, update);
router.delete("/category/:id", adminMiddleware, deleteData);

module.exports = router;
