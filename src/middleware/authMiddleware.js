const jwt = require("jsonwebtoken");

exports.authGuard = async (req, res, next) => {
  try {
    // Get Token
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    // console.log(authHeader);

    // Remove Bearer
    const token = authHeader.replace("Bearer ", "");

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store User Data
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};