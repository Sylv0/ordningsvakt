const environment = require("../knexfile")[
  process.env.ENVIRONMENT || "development"
];

const knex = require("knex")(environment);

module.exports = knex;
