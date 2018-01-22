exports.up = function(knex, Promise) {
  return knex.schema.createTable('income', (table)=> {
    table.increments();
    table.string('income_description').notNullable();
    table.decimal('income_budget').notNullable();
    table.decimal('income_amount_received').defaultTo(0);
    table.integer('users_id')
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('income')
};
