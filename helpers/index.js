const { sign } = require("jsonwebtoken");
const { jwtSecret, baseUrl } = require("../config");

const getJwtToken = (payload) => {
  const token = sign(payload, jwtSecret);
  return token;
};

const paginationObj = (
  length,
  limit = 10,
  currentPage = 1,
  queryOption = {}
) => {
  let prev = "null",
    next = "null";
  const totalPage = Math.ceil(length / limit);

  if (parseInt(currentPage) > 1) {
    prev = `${baseUrl}/api/v1/products?page=${parseInt(currentPage) - 1}`;

    for (let query in queryOption) {
      if (queryOption[query] != null) {
        prev += `&${query}=${queryOption[query]}`;
      }
    }
  }

  if (parseInt(currentPage) < totalPage) {
    next = `${baseUrl}/products?page=${parseInt(currentPage) + 1}`;
    for (let query in queryOption) {
      if (queryOption[query] != null) {
        next += `&${query}=${queryOption[query]}`;
      }
    }
  }

  return {
    total_page: totalPage,
    prev,
    next,
  };
};

module.exports = { getJwtToken, paginationObj };
