const Product = require("../models/Product");
const Category = require("../models/Category");

const {
  createProductValidation,
  updateProductValidation,
} = require("../validation/userValidation");

exports.createProduct = async (req, res) => {
  try {
    const { error } = createProductValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { name, description, price, stock, categoryId, status } = req.body;

    

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

   

    const childCategory = await Category.findOne({
      parentId: categoryId,
    });

    if (childCategory) {
      return res.status(400).json({
        success: false,
        message: "Please select the last level category.",
      });
    }


    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/product/${file.filename}`);
    }


    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      images,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: product,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.body || {};

    let query = {};

    if (categoryId) {
      query.categoryId = categoryId;
    }

    const products = await Product.find(query)
      .populate("categoryId", "name")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.log("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const { error } = updateProductValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { name, description, price, stock, categoryId, status } = req.body;

    if (categoryId) {
      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const childCategory = await Category.findOne({
        parentId: categoryId,
      });

      if (childCategory) {
        return res.status(400).json({
          success: false,
          message: "Please select the last level category.",
        });
      }
    }

    let images = product.images || [];


    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        categoryId,
        status,
        images,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("categoryId", "name");

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
