const Food = require("../models/Food");

module.exports = {
  addFood: async (req, res) => {
    const newFood = new Food(req.body);

    try {
      await newFood.save();
      res
        .status(200)
        .json({ status: true, message: " Food item added successfullt" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }
      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ status: false, message: "Food item not found" });
    }
  },

  getFoodByVendor: async (req, res) => {
    const vendorId = req.params.vendorId;

    try {
      const food = await Food.find({ vendorId: vendorId });

      if (!food || food.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }
      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteFoodById: async (req, res) => {
    const foodId = req.params.id;
    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }
      await Food.findByIdAndDelete(foodId);
      res
        .status(200)
        .json({ status: true, message: "Food item deleted sucessfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  foodAvailability: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }
      food.isAvailable = !food.isAvailable;

      await food.save();
      res
        .status(200)
        .json({
          status: true,
          message: "Food item availability updated sucessfully",
        });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateFoodItemById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedFood) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not updated" });
      }

      res
        .status(200)
        .json({ status: true, message: "food item successfully updated" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  addFoodTag: async (req, res) => {
    const foodId = req.params.id;
    const { tag } = req.body;

    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }
      if (food.foodTags.include(tag)) {
        return res
          .status(400)
          .json({ status: false, message: "Tag already exists" });
      }
      food.foodTags.push(tag);
      await food.save();
      res.status(200).json({ status: true, message: "Tag added sucessfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomFoodByCode: async (req, res) => {
    try {
      const randomFoodItem = await Food.aggregate([
        { $match: { code: req.params.code } },
        { $sample: { size: 5 } },
        { $project: { _id: 0 } },
      ]);
      res.status(200).json(randomFoodItem);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  addFoodType: async (req, res) => {
    const foodId = req.params.id;
    const { foodType } = req.body.foodType;

    try {
      const food = await Food.findById(foodId);
      if (!food) {
        return res.status(404).json({ status: false, message: error.message });
      }
      if (food.foodTypes.include(foodType)) {
        return res
          .status(400)
          .json({ status: false, message: "Food type already exists" });
      }
      food.foodTypes.push(foodType);
      await food.save();
      res
        .status(200)
        .json({ status: true, message: "Food type added sucessfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomBycategoryAndCode: async (req, res) => {
    const { category, code } = req.params;
    try {
      let food = await Food.aggregate([
        { $match: { category: category, code: code } },
        { $sample: { size: 10 } },
      ]);
      if (!food || food.length === 0) {
        food = await Food.aggregate([
          { $match: { code: code } },
          { $sample: { size: 10 } },
        ]);
      } else {
        food = await Food.aggregate([{ $sample: { size: 10 } }]);
      }
      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
