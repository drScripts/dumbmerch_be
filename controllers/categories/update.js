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
    const scheme = Joi.object({
      name: Joi.string().messages({
        "string.base": "Name must be a type of string",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category)
      return res.status(404).json({
        status: "Not found",
        message: "Cant find category",
      });

    const categoryNew = await category.update({ name });

    res.status(201).json({
      status: "created",
      data: { category: categoryNew },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
