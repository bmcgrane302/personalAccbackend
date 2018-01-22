
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'test@test.com', password: 'password'},
        {username: 'test2@test.com', password: 'password'}
      ]);
    });
};
