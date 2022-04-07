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
      name: Joi.string().required().messages({
        "string.base": "Name should be a type of string",
        "any.required": "Please insert your full name!",
      }),
      email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of string",
        "string.email": "Email should have a valid email type!",
        "any.required": "Please insert your email!",
      }),
      password: Joi.string().min(8).required().messages({
        "string.base": "Password should be a type of string",
        "string.min": "Password length must be greater than 8 character",
        "any.required": "Please insert your password!",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
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
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: {
        model: UserProfile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    });

    return res.status(201).json({
      status: "created",
      data: {
        user: newUser,
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
