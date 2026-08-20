
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// =====================================================
// CREATE ORDER
// =====================================================

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // User ka cart nikalo
    const cartItems = await Cart.find({
      userId: userId,
    }).populate("productId");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const items = cartItems.map((cartItem) => {
      const product = cartItem.productId;

      if (!product) {
        throw new Error("Product not found");
      }

      const price = Number(product.price);
      const quantity = Number(cartItem.quantity);

      totalAmount += price * quantity;

      return {
        productId: product._id,
        name: product.name,
        price: price,
        quantity: quantity,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : "",
      };
    });

    // Order create
    const order = await Order.create({
      userId: userId,
      items: items,
      totalAmount: totalAmount,
      status: "Pending",
    });

    // Order hone ke baad cart empty
    await Cart.deleteMany({
      userId: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// USER MY ORDERS
// =====================================================

exports.myOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      userId: userId,
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log("MY ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - GET ALL ORDERS
// =====================================================

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name mobile email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - UPDATE ORDER STATUS
// =====================================================

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      {
        new: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.log("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
