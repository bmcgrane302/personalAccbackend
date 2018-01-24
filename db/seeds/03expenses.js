
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('expenses').del()
    .then(function () {
      // Inserts seed entries
      return knex('expenses').insert([
        {expense_description: 'food',
         expense_budget: 400.00,
         expense_amount_paid: 450.00,
         users_id: 1
       },
       {expense_description: 'gas',
        expense_budget: 200.00,
        expense_amount_paid: 0.00,
        users_id: 1
      },
       {expense_description: 'gas',
        expense_budget: 200.00,
        expense_amount_paid: 180.00,
        users_id: 2
      }
      ]);
    });
};
