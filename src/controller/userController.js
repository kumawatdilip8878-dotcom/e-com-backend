const User = require("../models/user");
const bcrypt = require("bcrypt");

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    console.log("Get All Users API Called");

    const users = await User.find().select("-password -otp").sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Users fetch failed",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE USER
// =====================================================

const getUserById = async (req, res) => {
  try {
    const id = typeof req.body.id === "string" ? req.body.id.trim() : "";

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id).select("-password -otp");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE USER
// =====================================================

const createUser = async (req, res) => {
  try {
    const { name, mobile, email, password, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile is required",
      });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile must be 10 digits",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Check mobile
    const mobileExists = await User.findOne({
      mobile: mobile.trim(),
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    // Check email
    const emailExists = await User.findOne({
      email: email.trim(),
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      password: hashedPassword,
      status: status || "Y",
    });

    const userData = await User.findById(user._id).select("-password -otp");

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (error) {
    console.log("Create User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const id = typeof req.body.id === "string" ? req.body.id.trim() : "";

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, mobile, email, password, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10 digit mobile is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check duplicate mobile
    const mobileExists = await User.findOne({
      mobile: mobile.trim(),
      _id: { $ne: id },
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    // Check duplicate email
    const emailExists = await User.findOne({
      email: email.trim(),
      _id: { $ne: id },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    user.name = name.trim();
    user.mobile = mobile.trim();
    user.email = email.trim();

    if (status) {
      user.status = status;
    }

    // Password only update if entered
    if (password && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const updatedUser = await User.findById(id).select("-password -otp");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = typeof req.body.id === "string" ? req.body.id.trim() : "";

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle status
    user.status = user.status === "Y" ? "N" : "Y";

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        user.status === "Y"
          ? "User activated successfully"
          : "User deactivated successfully",

      data: {
        id: user._id,
        status: user.status,
      },
    });
  } catch (error) {
    console.log("CHANGE USER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change user status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus,
};
