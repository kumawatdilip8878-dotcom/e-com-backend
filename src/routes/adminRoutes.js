const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const profile = require("../controller/profileController");
const { authGuard } = require("../middleware/authMiddleware");
const createUploader = require("../middleware/uploadMiddleware");
const categoryController = require("../controller/categoryController");
const productController = require("../controller/productController");
const pageController = require("../controller/pageController");
const dashboardController = require("../controller/dashboardController");
const orderController = require("../controller/orderController");
const userController = require("../controller/userController");

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/loginby", authController.loginby);
router.post("/auth/login", authController.login);
router.post("/auth/verfyOtp", authController.verfyOtp);
router.post("/auth/forget", authController.forget);
router.post("/auth/otpVerfy", authController.otpVerfy);
router.post("/auth/resetPassword", authController.resetPassword);

router.use(authGuard);

router.post("/dashboard", dashboardController.dashboard);
// Profile Routes
router.post("/profile/get", profile.profile);
router.post(
  "/profile/edit",
  createUploader("profile").single("profileImage"),
  profile.editProfile,
);
router.post("/changePassword", profile.changePassword);
// Category Routes
router.post(
  "/category",
  createUploader("category").single("categoryImage"),
  categoryController.createCategory,
);
router.post("/allCategory", categoryController.getAllCategories);
router.post("/oneCategory", categoryController.getCategoryById);
router.post(
  "/updateCategory",
  createUploader("category").single("categoryImage"),
  categoryController.updateCategory,
);
router.post("/deleteCategory", categoryController.deleteCategory);
router.post("/changeCategoryStatus", categoryController.changeCategoryStatus);

// Create Product
router.post(
  "/create/product",
  createUploader("product").array("productImages", 5),
  productController.createProduct,
);
router.post("/getAll/product", productController.getAllProducts);
router.post("/get/product", productController.getProductById);
router.post(
  "/update/product",
  createUploader("product").array("productImages", 5),
  productController.updateProduct,
);
router.post("/delete/product", productController.deleteProduct);

// cms
router.post("/create/page", pageController.createPage);
router.post("/getAll/page", pageController.getAllPages);
router.post("/get/page", pageController.getPageBySlug);
router.post("/update/page", pageController.updatePage);
router.post("/delete/page", pageController.deletePage);

router.post("/order/getAll", orderController.getAllOrders);
router.post("/order/updateStatus", orderController.updateOrderStatus);
router.post("/users", userController.getAllUsers);

router.post("/user", userController.getUserById);

router.post("/createUser", userController.createUser);

router.post("/updateUser", userController.updateUser);

router.post("/deleteUser", userController.deleteUser);

router.post("/changeUserStatus", userController.changeUserStatus);
module.exports = router;
