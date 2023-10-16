const { Sequelize } = require("sequelize");

module.exports = new Sequelize(process.env.DB_LINK, {
  dialect: "postgres",
  protocol: "postgres",
  port: process.env.DB_PORT,
  host: "db",
  dialectOptions: {
    // ssl: true,
    native: true,
  },
});
