
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('income').del()
    .then(function () {
      // Inserts seed entries
      return knex('income').insert([
        {income_description: 'Pay Check',
         income_budget: 4000.00,
         income_amount_received: 0.00,
         users_id: 1
       },
         {income_description: 'Pay Check 2',
          income_budget: 3000.00,
          income_amount_received: 1000.00,
          users_id: 1
        },
       {income_description: 'Pay Check',
        income_budget: 5000.00,
        income_amount_received: 6000.00,
        users_id: 2
       }

      ]);
    });
};
