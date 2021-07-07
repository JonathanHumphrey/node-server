const {Pool} = require('pg')
require('dotenv').config()
// Destructure pool from the pg library
const pool = new Pool()
// create a new pool
// TODO: research what the fuck this does in the knex docs

module.exports = {
    query: (text, params) => pool.query(text, params)
}
