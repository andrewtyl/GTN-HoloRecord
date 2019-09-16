knexcon_config = process.env.ELEPHANT_SQL_ADDRESS

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  KNEX_CON: knexcon_config
}