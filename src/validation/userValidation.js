const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  mobile: Joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.empty": "Mobile number is required",
      "any.required": "Mobile number is required",
      "string.pattern.base": "Mobile number must contain exactly 10 digits",
    }),

  password: Joi.string().min(6).max(20).required(),
})


// login
const loginByValidation = Joi.object({

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

  password: Joi.string()
    .min(6)
    .max(20)
    // .required()
    .messages({
      "string.empty": "Password is required"
    }),
})
.xor("email", "mobile")

const loginValidation = Joi.object({

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

})

 const verfyOtpValidation = Joi.object({
  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
      "any.required": "Mobile number is required",
    }),

  otp: Joi.string()
   
   .trim()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
}); 





//forget /verfy/new

  

const forgetValidation = Joi.object({

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

})





  const verfyForgetValidation = Joi.object({
   mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  otp: Joi.string()
   
   .trim()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
}); 


const resetPasswordValidation = Joi.object({
  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required(),

  newPassword: Joi.string()
    .min(6)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password does not match",
    }),
});

const getProfileValidation = Joi.object({

   name: Joi.string().trim().min(2).max(50).optional(),

  email: Joi.string().trim().email().optional(),

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

});

const editProfileValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),

  email: Joi.string().trim().email().optional(),

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
}).min(1);

const changePasswordValidation = Joi.object({
   oldPassword: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Old password is required",
      "any.required": "Old password is required",
    }),


  newPassword: Joi.string()
    .trim()
    .min(6)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters",
      "any.required": "New password is required",
    }),

  confirmPassword: Joi.string()
    .trim()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password does not match new password",
      "string.empty": "Confirm password is required",
      "any.required": "Confirm password is required",
    }),
});

const createCategoryValidation= Joi.object({
  name:Joi.string().trim().required().messages({
    "string.empty":"category name is requires",

  }),
  description: 
 Joi.string().trim().required().messages({
     "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
   parentId:Joi.string().allow("",null),
   status:Joi.string().valid("Y","N").default("Y")
  })

  const updateCategoryValidation = Joi.object({
  id : Joi.string().hex().length(24).required(),

  name: Joi.string().trim().optional(),

  description: Joi.string().trim().optional(),

  parentId: Joi.string().allow("", null).optional(),

  status: Joi.string().valid("Y", "N").optional(),
});


const createProductValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),

  description: Joi.string()
    .required()
    .messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

  price: Joi.number()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "any.required": "Price is required",
    }),

  stock: Joi.number()
    .required()
    .messages({
      "number.base": "Stock must be a number",
      "any.required": "Stock is required",
    }),

  categoryId: Joi.string()
    .required()
    .messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),

  status: Joi.string()
    .valid("Y", "N")
    .optional(),
});


const updateProductValidation = Joi.object({
    id : Joi.string().hex().length(24).required(),

  name: Joi.string().optional(),

  description: Joi.string().optional(),

  price: Joi.number()
    .optional()
    .messages({
      "number.base": "Price must be a number",
    }),

  stock: Joi.number()
    .optional()
    .messages({
      "number.base": "Stock must be a number",
    }),

  categoryId: Joi.string().optional(),

  status: Joi.string()
    .valid("Y", "N")
    .optional(),
});


// Create Page Validation

// Create Page
const createPageValidation = Joi.object({
  title: Joi.string().required(),

  slug: Joi.string().required(),

  content: Joi.string().required(),

  status: Joi.string()
    .valid("Y", "N")
    .default("Y"),
});


// Get Page By Slug
const getPageValidation = Joi.object({
  slug: Joi.string().required(),
});


// Update Page
const updatePageValidation = Joi.object({
  id: Joi.string().required(),

  title: Joi.string().optional(),

  slug: Joi.string().optional(),

  content: Joi.string().optional(),

  status: Joi.string()
    .valid("Y", "N")
    .optional(),
});


// Delete Page
const deletePageValidation = Joi.object({
  id: Joi.string().required(),
});


module.exports = {
  createPageValidation,
  getPageValidation,
  updatePageValidation,
  deletePageValidation,
};

module.exports = {
  registerValidation,
  loginByValidation,
  loginValidation,
  verfyOtpValidation,
  forgetValidation,
  resetPasswordValidation,
  verfyForgetValidation,
   getProfileValidation,
  editProfileValidation,
    changePasswordValidation,
     createCategoryValidation,
  updateCategoryValidation,
  createProductValidation,
  updateProductValidation,
  createPageValidation,
  getPageValidation,
  updatePageValidation,
  deletePageValidation,
};
