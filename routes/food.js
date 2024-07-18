const router = require("express").Router();
const foodController = require("../controllers/foodController");
const { verifyVendor } = require("../middelware/verifyToken");

router.post("/", verifyVendor, foodController.addFood);

router.post("/tag/:id", verifyVendor, foodController.addFoodTag);

router.post("/type/:id", verifyVendor, foodController.addFoodType);

router.get("/:id", foodController.getFoodById);

router.get("/:category/:code", foodController.getRandomBycategoryAndCode);

router.delete("/:id", verifyVendor, foodController.deleteFoodById);

router.patch("/:id", verifyVendor, foodController.foodAvailability);

router.get("/resturant/:resturantId", foodController.getFoodByVendor);

router.get("/resturant/:resturantId", foodController.getFoodByVendor);

module.exports = router;
