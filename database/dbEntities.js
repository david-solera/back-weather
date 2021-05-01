const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("./dbConfig");
const weatherDB = dbConfig.weatherDB;

// COUNTRY
const Country = weatherDB.define(
  "country",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// CITY
const City = weatherDB.define(
  "city",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    lat: { type: DataTypes.STRING},
    lon: { type: DataTypes.STRING},
    countryId: { type: Sequelize.INTEGER, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// Constraints
Country.hasMany(City,{foreignKey: {name: 'countryId'}});
City.belongsTo(Country, {foreignKey: 'accountId'})

module.exports = {
  Country,
  City
};
