const { request, response } = require("express");
const Joi = require("joi");
const { UserProfile, User } = require("../../models");
const { getFileImageUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      phone_number: Joi.string().min(9).messages({
        "string.base": "Phone number must be a type of string",
        "string.min": "Phone number must be a valid indonesian phone number",
      }),
      gender: Joi.string().valid("male", "female").messages({
        "string.base": "Gender must be a type of string",
        "any.only": "Gender value must be either male or female",
      }),
      address: Joi.string().messages({
        "string.base": "Address must be a type of string",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { phone_number, gender, address } = req.body;
    const file = req.file;
    const { id } = req.user;

    const data = { phone_number, gender, address };

    if (file) {
      data.profile_picture = file.filename;
    }

    await UserProfile.update(data, { where: { userId: id } });

    const user = await User.findByPk(id, {
      include: {
        model: UserProfile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    user.profile.profile_picture = getFileImageUrl(
      user.profile.profile_picture,
      "users"
    );

    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
