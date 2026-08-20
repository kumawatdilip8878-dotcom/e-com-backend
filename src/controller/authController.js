// exports.login = (req, res) => {
//   res.send("login succesful");
// };

// exports.register = (req, res) => {
//   res.send("register succesful");
// };

// REGISTER ..
// exports.register = async (req, res) => {
//   try {
//     const { name, email, mobile, password } = req.body;

//     if (!name || !email || !mobile || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required (name, email, mobile, password)",
//       });
//     }

//     if (name.length < 3) {
//       return res.status(400).json({
//         success: false,
//         message: "Name must be at least 3 characters",
//       });
//     }

//     if (mobile.length !== 10) {
//       return res.status(400).json({
//         success: false,
//         message: "Mobile number must be 10 digits",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const existingUser = await User.findOne({
//       $or: [{ email }, { mobile }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or Mobile already exists",
//       });
//     }

//     const user = await User.create({
//       name,
//       email,
//       mobile,
//       password,
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
  verfyOtpValidation,
  forgetValidation,
  verfyForgetValidation,
  loginByValidation,
 
  resetPasswordValidation,
} = require("../validation/userValidation");
const sendMail= require("../utills/sendMail")




const { generateOtpLoop } = require("../utills/helper");




exports.register = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { name, mobile, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
await sendMail(
  email,
  "register successfull",
  `<h2>hello${name}</h2>
  <p>account hacked by dilip</p>`
)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data:user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.loginby = async (req, res) => {
  try {
    const { error } = loginByValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Password Check
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      process.env.Jwt_SECRET,
      {
        expiresIn: "3h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      data: user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
     const { error } = loginValidation.validate(req.body);

    console.log(error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      })
    }
    const {mobile} = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6 digit OTP
    const otp = generateOtpLoop()

    user.otp = otp;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP send done",
      otp
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// otp
exports.verfyOtp = async (req, res) => {
  try {
     const { error } = verfyOtpValidation.validate(req.body);

    console.log(error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { mobile, otp } = req.body;

if (mobile) {
      user = await User.findOne({mobile });
       if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid  mobile",
      });
    }
  }

    if (user.otp !=otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP remove after login
    user.otp = null;

    await user.save();

const token=jwt.sign(
  {
    id:user._id,
    email:user.email,mobile:user,mobile,
    role:user.role
    },
    process.env.Jwt_SECRET,
    {
      expiresIn:"1h"
    }
)
 return res.status(200).json({
      success: true,
      message: "Login Successful",
      data: user,
      token
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.forget = async (req, res) => {
  try {
    const { error } = forgetValidation.validate(req.body);

    console.log(error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6 digit OTP
    const otp = generateOtpLoop();

    user.otp = otp;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP send done",
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// foeget
exports.otpVerfy = async (req, res) => {
  try {
    const { error } = verfyForgetValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });
    console.log(user.isOtpVerified);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid mobile",
      });
    }

    if (user.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified
    user.isOtpVerified = true;
    user.otp = null;

    await user.save();

    // OTP verify ho gay
return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//resetpaswword
exports.resetPassword = async (req, res) => {
  const bcrypt = require("bcrypt");

  try {
    const { error } = resetPasswordValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { mobile, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    // Check old password
    const isMatch = await bcrypt.compare(newPassword, user.password);

    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save hashed password
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};