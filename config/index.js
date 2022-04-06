require("dotenv").config();

module.exports = {
  dbHost: process.env.DATABASE_HOST,
  dbUser: process.env.DATABASE_USER,
  dbPass: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  dbDialect: process.env.DATABASE_DIALECT,
  dbPort: process.env.DATABASE_PORT,
  rajaOngkirKey: process.env.RAJA_ONGKIR_KEY,
  rajaOngkirOrigin: process.env.RAJA_ONGKIR_ORIGIN,
  baseUrl: process.env.APP_BASE_URL,
  jwtSecret: process.env.APP_JWT_SECRET,
  snapUrl: process.env.SNAP_MIDTRANS_URL,
  snapServerKey: process.env.SNAP_MIDTRANS_SERVER_KEY,
  clientUrl: process.env.ALLOW_CLIENT_URL,
};
