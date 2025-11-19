const knex = require('knex');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const config = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_kampus_db',
      charset: 'utf8mb4',
    },
    migrations: {
      directory: path.join(__dirname, '../migrations'),
      extension: 'js',
    },
    seeds: {
      directory: path.join(__dirname, '../seeds'),
      extension: 'js',
    },
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 10000,
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
    },
    migrations: {
      directory: path.join(__dirname, '../migrations'),
      extension: 'js',
    },
    pool: { min: 2, max: 10 },
  },
};

const instance = knex(config[environment]);

module.exports = instance;