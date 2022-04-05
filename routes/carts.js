const router = require("express").Router();
const { list, add, update, deleteData } = require("../controllers/cart");

router.get("/carts", list);
router.post("/cart", add);
router.patch("/cart/:id", update);
router.delete("/cart/:id", deleteData);

module.exports = router;
