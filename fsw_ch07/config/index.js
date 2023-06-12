const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
    database: process.env.PG_DATABASE_NAME,
    host: process.env.PG_DATABASE_HOST,
    port: process.env.PG_DATABASE_PORT,
    username: process.env.PG_DATABASE_USER,
    password: process.env.PG_DATABASE_PASSWORD,
    schema: process.env.PG_DATABASE_SCHEMA,
    dialect: 'postgres'
})

module.exports = { sequelize }
