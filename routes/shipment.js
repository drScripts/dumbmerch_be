const router = require("express").Router();
const { province, cities, cost } = require("../controllers/shipment");

router.get("/shipment/provinces", province);
router.get("/shipment/cities/:provinceId", cities);
router.get("/shipment/cost", cost);

module.exports = router;
