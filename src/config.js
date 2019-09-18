knexcon_config = process.env.SQL_ADDRESS

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  KNEX_CON: knexcon_config
}