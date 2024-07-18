const e = require("express");
const Cart = require("../models/Cart");

module.exports = {
  addProductToCart: async (req, res) => {
    const userId = req.user.id;
    const { productId, totalPrice, quantity } = req.body;
    let count;

    try {
      const existingProduct = await Cart.findOne({ userId, productId });
      count = await Cart.countDocuments({ userId });
      if (existingProduct) {
        (existingProduct.quantity += 1),
          (existingProduct.totalPrice += totalPrice),
          await existingProduct.save();
      } else {
        const newCart = new Cart({
          userId: userId,
          productId: req.body.productId,
          additives: req.body.additives,
          instructions: req.body.instructions,
          totalPrice: req.body.totalPrice,
          quantity: req.body.quantity,
        });
        await newCart.save();
        count = await Cart.countDocumnet({ userId });
      }
      res.status(200).json({ status: true, count: count });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeProductFromCart: async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
      const cartItem = await Cart.findById({ itemId });

      if (!cartItem) {
        return res
          .status(400)
          .json({ status: false, message: "Cart item not found." });
      }
      await Cart.findByIdAndDelete({ _id: itemId });
      count = await Cart.countDocuments({ userId });
      res.status(200).json({ status: true, cartCount: count });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  fetchUserCart: async (req, res) => {
    const userId = req.user.id;
    try {
      const useCart = await Cart.find({ userId: userId }).populate({
        path: "productId",
        select: "title imageUrl vendor rating artingCount",
      });
      res.status(200).json({ status: true, cart: useCart });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  clearUserCart: async (req, res) => {
    const userId = req.user.id;
    let count;
    try {
      await Cart.deleteMany({ userId: userId });
      count = await Cart.countDocuments({ userId });
      res.status(200).json({
        status: true,
        count: count,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getCartCount: async (req, res) => {
    const userId = req.user.id;
    try {
      const userId = req.user.id;
      if (!userId) {
        return res
          .status(400)
          .json({ status: false, message: "User ID is required" });
      }
      const cartItems = await Cart.find({ user: userId });
      const itemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      res.status(200).json({ status: true, count: itemCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: error.message });
    }
  },

  decrementProductQty: async (req, res) => {
    const productId = req.params.productId;
    try {
      const userId = req.user.id;
      const { productId } = req.body;
      if (!userId) {
        return res
          .status(400)
          .json({ status: false, message: "User ID is required" });
      }
      if (!productId) {
        return res
          .status(400)
          .json({ status: false, message: "Product ID is required" });
      }
      const cartItem = await Cart.findOne({ user: userId, product: productId });
      if (!cartItem) {
        return res
          .status(404)
          .json({ status: false, message: "Cart item not found" });
      }
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
      } else {
        await cartItem.remove();
      }
      res.status(200).json({
        status: true,
        message: "Product quantity decremented successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: error.message });
    }
  },
};
