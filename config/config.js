const {
  dbDialect,
  dbHost,
  dbName,
  dbPass,
  dbPort,
  dbUser,
  dbIsSSL,
  dbrejectUnAuthorized,
} = require("./");

const productionConfig = {
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
  protocol: "postgres",
};

if (dbIsSSL) {
  productionConfig.dialectOptions = {
    ssl: {
      require: dbIsSSL,
      rejectUnauthorized: dbrejectUnAuthorized,
    },
  };
}

module.exports = {
  development: {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    dialect: dbDialect,
    port: dbPort,
  },
  test: {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    dialect: dbDialect,
    port: dbPort,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    protocol: "postgres",
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
