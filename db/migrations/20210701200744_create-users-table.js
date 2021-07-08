
exports.up = function(knex) {
  return knex.schema.createTable('users', (tbl) => {
      tbl.increments();
      tbl.string('username', 30).unique();
      tbl.string('firstname', 30).notNull();
      tbl.string('lastname', 30).notNull();
      tbl.string('email', 30).unique();
      tbl.string('password');
      tbl.string('user_type').notNull().defaultTo('client');
      tbl.string('resetLink', 255);
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};

// NOTES: 
// - Tables are created and dropped in FILO fashion
// - Order needs to mimic this in the database calls 
