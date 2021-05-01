const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("./dbConfig");
const weatherDB = dbConfig.weatherDB;

// COUNTRY
const Country = weatherDB.define(
  "country",
  {
    countrycode: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true },
    countrycode: { type: DataTypes.STRING, allowNull: false },
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
    cityid: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    lat: { type: DataTypes.STRING},
    lon: { type: DataTypes.STRING},
    countrycode: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// Constraints
Country.hasMany(City,{foreignKey: {name: 'countrycode'}});
City.belongsTo(Country, {foreignKey: 'countrycode'})

module.exports = {
  Country,
  City
};
