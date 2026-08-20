const express = require("express");
const router = express.Router();

const { authGuard } = require("../middleware/authMiddleware");

const authController = require("../controller/authController");
const profileController = require("../controller/profileController");
const categoryController = require("../controller/categoryController");
const productController = require("../controller/productController");
const pageController = require("../controller/pageController");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");

// =====================================================
// AUTH ROUTES
// =====================================================

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/verfyOtp", authController.verfyOtp);
router.post("/auth/forget", authController.forget);
router.post("/auth/otpVerfy", authController.otpVerfy);
router.post("/auth/resetPassword", authController.resetPassword);

// =====================================================
// PUBLIC PRODUCT ROUTES
// =====================================================

router.post("/products", productController.getAllProducts);
router.post("/product", productController.getProductById);

// =====================================================
// PUBLIC CATEGORY ROUTES
// =====================================================

router.post("/categories", categoryController.getAllCategories);
router.post("/category", categoryController.getCategoryById);

// =====================================================
// PUBLIC CMS PAGE ROUTES
// =====================================================

router.post("/pages", pageController.getAllPages);
router.post("/page", pageController.getPageBySlug);

// =====================================================
// PROTECTED USER ROUTES
// =====================================================

router.use(authGuard);

// =====================================================
// PROFILE
// =====================================================

router.post(
  "/profile",
  profileController.profile
);

router.post(
  "/profile/edit",
  profileController.editProfile
);

router.post(
  "/changePassword",
  profileController.changePassword
);

// =====================================================
// CART
// =====================================================

// Add to cart
router.post(
  "/cart/add",
  cartController.addToCart
);

// Get cart
router.post(
  "/cart",
  cartController.getCart
);

// Remove cart item
router.post(
  "/cart/:id",
  cartController.removeCart
);

// =====================================================
// ORDER
// =====================================================

// Create Order
router.post(
  "/order/create",
  orderController.createOrder
);

// Get My Orders
router.post(
  "/orders",
  orderController.myOrders
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;