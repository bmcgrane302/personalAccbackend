exports.up = function(knex, Promise) {
  return knex.schema.createTable('expenses', (table)=> {
    table.increments();
    table.string('expense_description').notNullable();
    table.decimal('expenses_budget').notNullable();
    table.decimal('expenses_amount_paid').defaultTo(0);
    table.integer('users_id')
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('expenses')
};
