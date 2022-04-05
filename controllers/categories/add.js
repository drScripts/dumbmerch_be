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
    const scheme = Joi.object({
      name: Joi.string().required(),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: "Error body!",
        validation_error: validation.error.details,
      });

    const { name } = req.body;

    const category = await Category.create({ name });

    res.status(201).json({
      status: "created",
      data: { category },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
