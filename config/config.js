const { dbDialect, dbHost, dbName, dbPass, dbPort, dbUser } = require("./");

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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
