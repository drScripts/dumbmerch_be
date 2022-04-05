const { request, response } = require("express");
const Joi = require("joi");
const { hashSync } = require("bcrypt");
const { User, UserProfile } = require("../../models");
const { getJwtToken } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: "Error body!",
        validation_error: validation.error.details,
      });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password: hashSync(password, 15),
    });

    await UserProfile.create({
      userId: user.id,
    });

    const newUser = await User.findByPk(user.id, {
      attributes: {
        exclude: ["password"],
      },
      include: "profile",
    });

    return res.status(201).json({
      status: "created",
      data: {
        newUser,
        token: getJwtToken(newUser.dataValues),
        token_type: "Bearer",
      },
    });
  } catch (err) {
    console.log(err);
    const code = err?.name;

    const message =
      code === "SequelizeUniqueConstraintError"
        ? "Email has been taken. Please use another email"
        : err.message;

    const status = code === "SequelizeUniqueConstraintError" ? 409 : 500;

    return res.status(status).json({
      status: "error",
      message,
    });
  }
};
