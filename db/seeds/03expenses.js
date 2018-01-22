
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('expenses').del()
    .then(function () {
      // Inserts seed entries
      return knex('expenses').insert([
        {expense_description: 'food',
         expenses_budget: 400.00,
         expenses_amount_paid: 450.00,
         users_id: 1
       },
       {expense_description: 'gas',
        expenses_budget: 200.00,
        expenses_amount_paid: 180.00,
        users_id: 2
      }
      ]);
    });
};
