const { request, response } = require("express");
const { Op } = require("sequelize");
const { Product, Category, User } = require("../../models");
const { paginationObj } = require("../../helpers");
const { baseUrl, dbDialect } = require("../../config");

const queryBuilder = (q, start, end) => {
  const obj = {};
  if (q || start || end) {
    if (q) {
      if (dbDialect === "postgres") {
        obj.name = {
          [Op.iLike]: `%${q}%`,
        };
      } else {
        obj.name = {
          [Op.like]: `%${q}%`,
        };
      }
    }

    if (start) {
      obj.price = {
        [Op.gte]: start,
      };
    }

    if (end) {
      obj.price = {
        [Op.lte]: end,
      };
    }

    if (start && end) {
      obj.price = {
        [Op.between]: [start, end],
      };
    }

    return {
      [Op.and]: obj,
    };
  } else {
    return null;
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const {
      q = null,
      page = 1,
      start = null,
      end = null,
      category = null,
    } = req.query;

    const dataLimit = 10;
    const dataOffset = page * dataLimit - dataLimit;

    const categoryQuery = category ? { id: category } : {};
    const searchQuery = queryBuilder(q, start, end);

    const { count, rows } = await Product.findAndCountAll({
      include: [
        {
          as: "categories",
          model: Category,
          where: categoryQuery,
          through: {
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          required: category !== null,
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: searchQuery,
      offset: dataOffset,
      limit: dataLimit,
    });

    rows.map((val, i) => {
      if (val.image_url.search("http") === -1) {
        val.image_url = `${baseUrl}/images/products/${val.image_name}`;
      }
      return val;
    });

    res.status(200).json({
      status: "success",
      data: {
        products: rows,
      },
      pagination: paginationObj(count, dataLimit, page, {
        q,
        start,
        end,
        category,
      }),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
