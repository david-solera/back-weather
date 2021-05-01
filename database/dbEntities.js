const { Sequelize, DataTypes } = require("sequelize");
const dbController = require("./dbConfig");
const kpiDB = dbController.kpiDB;

// USER
const User = kpiDB.define(
  "user",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    admin: { type: DataTypes.BOOLEAN }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// ACCESS LEVEL
const AccessLevel = kpiDB.define(
  "accesslevel",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    level: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// USER ACCESS
const UserAccess = kpiDB.define(
  "useraccess",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER, allowNull: false },
    levelId: { type: Sequelize.INTEGER, allowNull: false },
    objectId: { type: Sequelize.INTEGER, allowNull: false },
    isDefault: {type: Sequelize.INTEGER, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

User.hasMany(UserAccess,{foreignKey: {
  name: 'userId'
}});
UserAccess.belongsTo(User);

// PROFILE
const Profile = kpiDB.define(
  "profile",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// USER PROFILE
const UserProfile = kpiDB.define(
  "userprofile",
  {
    userId: { type: Sequelize.INTEGER, allowNull: false },
    profileId: { type: Sequelize.INTEGER, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// CLUSTER
const Cluster = kpiDB.define(
  "cluster",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// COUNTRY
const Country = kpiDB.define(
  "country",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    clusterId: { type: Sequelize.INTEGER }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// ACCOUNT
const Account = kpiDB.define(
  "account",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING, allowNull: true },
    countryId: { type: Sequelize.INTEGER }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// METRIC AREA
const MetricArea = kpiDB.define(
  "metricArea",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// KPI AREA
const KpiArea = kpiDB.define(
  "kpiArea",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// METRIC
const Metric = kpiDB.define(
  "metric",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    suffix: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    areaId: { type: Sequelize.INTEGER, allowNull: false },
    order: {type: Sequelize.INTEGER, allowNull: false}
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

// ACCOUNT METRIC
const AccountMetric = kpiDB.define(
  "accountmetric",
  {
    metricId: { type: Sequelize.INTEGER, allowNull: false },
    accountId: { type: Sequelize.INTEGER, allowNull: false },
    value: { type: DataTypes.FLOAT },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: Sequelize.DATE }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);
AccountMetric.removeAttribute("id");

// metric - Account metric association
Metric.hasMany(AccountMetric, {foreignKey: 'metricId'})
AccountMetric.belongsTo(Metric, {foreignKey: 'metricId'})

// Account - AccountMetric  association
Account.hasMany(AccountMetric, {foreignKey: 'accountId'})
AccountMetric.belongsTo(Account, {foreignKey: 'accountId'})


// KPI
const Kpi = kpiDB.define(
  "kpi",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    suffix:  { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    areaId: { type: Sequelize.INTEGER, allowNull: false },
    formula: { type: DataTypes.STRING },
    order: {type: Sequelize.INTEGER, allowNull: false},
    minValue: { type: DataTypes.FLOAT },
    maxValue: { type: DataTypes.FLOAT }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);


// ACCOUNT KPI
const AccountKpi = kpiDB.define(
  "accountkpi",
  {
    kpiId: { type: Sequelize.INTEGER, allowNull: false },
    accountId: { type: Sequelize.INTEGER, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: Sequelize.DATE, allowNull: false },
    reason: { type: DataTypes.STRING }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);
AccountKpi.removeAttribute("id");

// Kpi - Account Kpi association
Kpi.hasMany(AccountKpi, {foreignKey: 'kpiId'})
AccountKpi.belongsTo(Kpi, {foreignKey: 'kpiId'})

// Account - AccountKPI  association
Account.hasMany(AccountKpi, {foreignKey: 'accountId'})
AccountKpi.belongsTo(Account, {foreignKey: 'accountId'})


module.exports = {
  Cluster,
  Country,
  Account,
  MetricArea,
  KpiArea,
  User,
  AccessLevel,
  UserAccess,
  Profile,
  UserProfile,
  Metric,
  AccountMetric,
  Kpi,
  AccountKpi
};
