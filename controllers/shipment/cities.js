const { request, response } = require("express");
const axios = require("axios").default;
const { rajaOngkirKey } = require("../../config");

/**
 *
 * @param {request} req
 * @param {response} res
 * @returns
 */
module.exports = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const { data } = await axios.get(
      "https://api.rajaongkir.com/starter/city",
      {
        params: {
          province: provinceId,
        },
        headers: {
          key: rajaOngkirKey,
        },
      }
    );

    const cities = data.rajaongkir.results;

    return res.status(200).json({
      status: "success",
      data: cities,
    });
  } catch (err) {
    console.log(err);

    if (err.response) {
      const { response } = err;
      return res.status(response.status).json({
        status: "error",
        message: response.statusText,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
