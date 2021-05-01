const Sequelize = require('sequelize');
const { dbInstance, dbUser, dbPassword, dbHost, dbPort, dbDialect } = require("../config/config");

//DATABASE SETTINGS
const weatherDB = new Sequelize(dbInstance, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

weatherDB.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {weatherDB};
