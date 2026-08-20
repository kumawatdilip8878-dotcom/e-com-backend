const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==========================================
// ADD TO CART
// ==========================================

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const userId = req.user.id;

    // ==========================================
    // CHECK PRODUCT
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // CHECK EXISTING CART ITEM
    // ==========================================

    const exist = await Cart.findOne({
      userId: userId,
      productId: productId,
    });

    // ==========================================
    // IF PRODUCT ALREADY EXISTS
    // ==========================================

    if (exist) {
      exist.quantity += 1;

      await exist.save();

      const updatedCart = await Cart.findById(
        exist._id
      ).populate("productId");

      return res.status(200).json({
        success: true,
        message: "Quantity Updated",
        cart: updatedCart,
      });
    }

    // ==========================================
    // CREATE NEW CART ITEM
    // ==========================================

    const cart = await Cart.create({
      userId: userId,
      productId: productId,
      quantity: 1,
    });

    // ==========================================
    // POPULATE PRODUCT
    // ==========================================

    const populatedCart = await Cart.findById(
      cart._id
    ).populate("productId");

    res.status(201).json({
      success: true,
      message: "Added To Cart",
      cart: populatedCart,
    });
  } catch (err) {
    console.log("Add Cart Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// GET CART
// ==========================================

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({
      userId: userId,
    })
      .populate("productId")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      cart: cart,
    });
  } catch (err) {
    console.log("Get Cart Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// REMOVE CART
// ==========================================

exports.removeCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cart ID is required",
      });
    }

    const cart = await Cart.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed Successfully",
    });
  } catch (err) {
    console.log("Remove Cart Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};