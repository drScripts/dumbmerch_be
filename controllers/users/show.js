const { request, response } = require("express");
const { getFileImageUrl } = require("../../helpers");
const { User, UserProfile } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 * @returns
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      include: {
        model: UserProfile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    user.profile.profile_picture = getFileImageUrl(
      user?.profile?.profile_picture,
      "users"
    );

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
