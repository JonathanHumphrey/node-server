
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          username: 'jhumps',
          firstname: 'Jonathan',
          lastname: 'Humphrey',
          email: 'jonny105596@outlook.com',
          password: 'password',
          user_type: 'administrator'
        },
        {
          id: 2,
          username: 'Test',
          firstname: 'Wingus',
          lastname: 'McCringus',
          email: 'wingusChun@gmail.com',
          password: 'password',
          user_type: 'administrator'
        }
      ]);
    });
};
