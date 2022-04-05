const { request, response } = require("express");
const { Category } = require("../../models");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category)
      return res.status(404).json({
        status: "Not found",
        message: "Cant find category",
      });

    await category.destroy();

    res.status(201).json({
      status: "created",
      message: "success delete category!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
