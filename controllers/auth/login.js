const Joi = require("joi");
const { request, response } = require("express");
const { User, UserProfile } = require("../../models");
const { compareSync } = require("bcrypt");
const { getJwtToken, getFileImageUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of string",
        "string.email": "Email should have a valid email type!",
        "any.required": "Please insert your email!",
      }),
      password: Joi.string().required().messages({
        "string.base": "Password should be a type of string",
        "any.required": "Please insert your password!",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: {
        model: UserProfile,
        as: "profile",
        attributes: {
          exclude: ["id", "userId", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });

    if (!compareSync(password, user.password))
      return res.status(401).json({
        status: "error",
        message: "Wrong password !",
      });

    delete user.dataValues.password;

    user.profile.profile_picture = getFileImageUrl(
      user?.profile?.profile_picture,
      "users"
    );

    const jwt = getJwtToken(user.dataValues);

    return res.status(200).json({
      status: "success",
      data: {
        user,
        token: jwt,
        token_type: "Bearer",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
