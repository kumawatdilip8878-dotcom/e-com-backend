const express = require("express");

const router = express.Router();

const cartController = require("../controller/cartController");

const { authGuard } = require("../middleware/authMiddleware");

router.post("/add", authGuard, cartController.addToCart);

router.post("/", authGuard, cartController.getCart);

router.post("/:id", authGuard, cartController.removeCart);

module.exports = router;