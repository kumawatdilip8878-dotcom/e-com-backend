const Page = require("../models/Page");

const {
  createPageValidation,
  getPageValidation,
  updatePageValidation,
  deletePageValidation,
} = require("../validation/userValidation");

exports.createPage = async (req, res) => {
  try {
    const { error } = createPageValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { title, slug, content, status } = req.body;

    const page = await Page.create({
      title,
      slug,
      content,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Page Created Successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();

    return res.status(200).json({
      success: true,
      message: "Pages fetched successfully",
      data: pages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const { error } = getPageValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { slug} = req.body;

    const page = await Page.findOne({ slug });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page fetched successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { error } = updatePageValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { id, title, slug, content, status } = req.body;

    const page = await Page.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        status,
      },
      {new :true}
    
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page Updated Successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { error } = deletePageValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { id } = req.body;

    const page = await Page.findByIdAndDelete(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
