const router = require("express").Router();
const vendorController = require("../controllers/vendorController");
const {
  verifyAndAuthorization,
  verifyVendor,
} = require("../middelware/verifyToken");

router.post("/", verifyAndAuthorization, vendorController.addVendor);

router.get("/byId/:id", vendorController.getVendor);

router.get("/:code", vendorController.getRandomVendor);

router.delete("/:id", verifyVendor, vendorController.deleteVendor);

router.patch("/:id", verifyVendor, vendorController.serviceAvaibility);

module.exports = router;
