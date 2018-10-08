exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table
        .string('userName')
        .unique()
        .notNullable();
      table
        .string('email')
        .unique()
        .notNullable();
      table.string('password').notNullable();
      table.boolean('changePassword').defaultTo(false);

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('users')]);
};
