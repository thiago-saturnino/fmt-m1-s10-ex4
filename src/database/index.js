const Sequelize = require("sequelize");

const connection = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "1234",
  database: "places",
  define: {
    timestamps: true,
    underscored: true,
    underscoresAll: true,
  },
});

module.exports = connection;
