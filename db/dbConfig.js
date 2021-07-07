require('dotenv').config();
const knex = require('knex')
const knexFile = require('../knexfile').development

module.exports = knex(require('../knexfile')[process.env.NODE_ENV]);