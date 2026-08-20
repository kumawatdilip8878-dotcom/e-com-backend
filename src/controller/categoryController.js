const Category = require("../models/Category");

const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../validation/userValidation");

// =====================================================
// CREATE CATEGORY
// =====================================================

exports.createCategory = async (req, res) => {
  try {
    console.log("CREATE CATEGORY BODY:", req.body);
    console.log("CREATE CATEGORY FILE:", req.file);

    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    const description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "";

    const parentId =
      typeof req.body.parentId === "string"
        ? req.body.parentId.trim()
        : "";

    const status =
      typeof req.body.status === "string"
        ? req.body.status.trim()
        : "Y";

    // =====================================================
    // REQUIRED FIELD CHECK
    // =====================================================

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Category description is required",
      });
    }

    // =====================================================
    // JOI VALIDATION
    // =====================================================

    const validationData = {
      name,
      description,
      status,
    };

    if (parentId) {
      validationData.parentId = parentId;
    }

    const { error } =
      createCategoryValidation.validate(
        validationData
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(
          /"/g,
          ""
        ),
      });
    }

    // =====================================================
    // PARENT CATEGORY
    // =====================================================

    if (parentId) {
      const parentCategory =
        await Category.findById(parentId);

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    // =====================================================
    // IMAGE
    // =====================================================

    let image = "";

    if (req.file) {
      image = `/category/${req.file.filename}`;
    }

    // =====================================================
    // CREATE
    // =====================================================

    const category = await Category.create({
      name,
      description,
      image,
      parentId: parentId || null,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

  } catch (error) {
    console.log(
      "CREATE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL CATEGORIES
// =====================================================

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });

  } catch (error) {
    console.log(
      "GET CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET CATEGORY BY ID
// =====================================================

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category =
      await Category.findById(id)
        .populate("parentId", "name");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });

  } catch (error) {
    console.log(
      "GET CATEGORY BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE CATEGORY
// =====================================================

exports.updateCategory = async (req, res) => {
  try {
   

    const id =
      typeof req.body.id === "string"
        ? req.body.id.trim()
        : "";

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    const description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "";

    const parentId =
      typeof req.body.parentId === "string"
        ? req.body.parentId.trim()
        : "";

    const status =
      typeof req.body.status === "string"
        ? req.body.status.trim()
        : "Y";

    // =====================================================
    // REQUIRED FIELD CHECK
    // =====================================================

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Category description is required",
      });
    }

    // =====================================================
    // FIND CATEGORY
    // =====================================================

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // =====================================================
    // JOI VALIDATION
    // =====================================================

    const validationData = {
      id,
      name,
      description,
      status,
    };

    if (parentId) {
      validationData.parentId = parentId;
    }

    const { error } =
      updateCategoryValidation.validate(
        validationData
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(
          /"/g,
          ""
        ),
      });
    }

    // =====================================================
    // PARENT VALIDATION
    // =====================================================

    if (parentId) {

      if (parentId === id) {
        return res.status(400).json({
          success: false,
          message:
            "Category cannot be its own parent",
        });
      }

      const parentCategory =
        await Category.findById(parentId);

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message:
            "Parent category not found",
        });
      }
    }

    // =====================================================
    // UPDATE DATA
    // =====================================================

    category.name = name;
    category.description = description;
    category.parentId = parentId || null;
    category.status = status;

    // =====================================================
    // UPDATE IMAGE
    // =====================================================

    if (req.file) {
      category.image =
        `/category/${req.file.filename}`;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message:
        "Category Updated Successfully",
      data: category,
    });

  } catch (error) {
    console.log(
      "UPDATE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE CATEGORY
// =====================================================

exports.deleteCategory = async (req, res) => {
  try {
    const id =
      typeof req.body.id === "string"
        ? req.body.id.trim()
        : "";

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Category Deleted Successfully",
    });

  } catch (error) {
    console.log(
      "DELETE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CHANGE CATEGORY STATUS
// =====================================================
exports.changeCategoryStatus = async (req, res) => {
  try {
    console.log("STATUS BODY:", req.body);

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Y = Active
    // N = Inactive

    category.status =
      category.status === "Y" ? "N" : "Y";

    await category.save();

    return res.status(200).json({
      success: true,
      message:
        category.status === "Y"
          ? "Category activated successfully"
          : "Category deactivated successfully",
      data: category,
    });

  } catch (error) {
    console.log(
      "CHANGE CATEGORY STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};