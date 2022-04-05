const { request, response } = require("express");
const axios = require("axios").default;
const { rajaOngkirKey, rajaOngkirOrigin } = require("../../config");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      destination_city: Joi.number().required(),
      courier: Joi.string().valid("jne", "pos", "tiki").required(),
    });

    const validation = scheme.validate(req.query);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: "Error body!",
        validation_error: validation.error.details,
      });

    const { destination_city, courier } = req.query;

    const { data } = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin: rajaOngkirOrigin,
        destination: destination_city,
        courier,
        weight: 1000,
      },
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
