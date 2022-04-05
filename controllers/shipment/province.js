const { request, response } = require("express");
const axios = require("axios").default;
const { rajaOngkirKey } = require("../../config");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          key: rajaOngkirKey,
        },
      }
    );

    const provences = data.rajaongkir.results;

    return res.send({
      status: "success",
      data: provences,
    });
  } catch (err) {
    if (err.response) {
      const { response } = err;
      return res.status(response.status).json({
        status: "error",
        message: response.statusText,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server error",
    });
  }
};
