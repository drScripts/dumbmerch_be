const express = require("express");
const router = express.Router();
const { fileUpload } = require("../middleware");
const { update, show } = require("../controllers/users");

router.get("/user", show);
router.patch("/user", fileUpload("image", "users", false), update);

module.exports = router;
