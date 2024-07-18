const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const { verifyAdmin } = require("../middelware/verifyToken");

router.put("/:id", verifyAdmin, categoryController.updateCategory);

router.post("/:id", verifyAdmin, categoryController.createCategory);

router.delete("/:id", verifyAdmin, categoryController.deleteCategory);

router.post("/image/:id", verifyAdmin, categoryController.patchCategoryImage);

router.get("/", categoryController.getAllCategories);

router.get("/random", categoryController.getRandomCatagories);

module.exports = router;
