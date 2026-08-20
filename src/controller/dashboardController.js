const Product = require("../models/Product");
const User = require("../models/user");

// ==========================================
// DASHBOARD
// ==========================================

const dashboard = async (req, res) => {
  try {
    const totalProducts =
      await Product.countDocuments();

    const totalUsers =
      await User.countDocuments();

    return res.status(200).json({
      success: true,
      message:
        "Dashboard data fetched successfully",

      data: {
        totalProducts: totalProducts,
        totalUsers: totalUsers,
      },
    });
  } catch (error) {
    console.log(
      "Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Dashboard data fetch failed",
      error: error.message,
    });
  }
};

module.exports = {
  dashboard,
};