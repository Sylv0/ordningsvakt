exports.up = function (knex) {
  return knex.schema.createTable("user_activity", function (table) {
    table.increments();
    table.integer("member").notNullable();
    table.string("name").notNullable();
    table.string("month").notNullable();
    table.integer("active_time").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_activity");
};
