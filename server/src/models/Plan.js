const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PortfolioApp = require('./PortfolioApp');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  month: {
    type: DataTypes.STRING, // e.g., "2025-01"
    allowNull: false
  },
  activityType: {
    type: DataTypes.STRING
  },
  priority: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  owner: {
    type: DataTypes.STRING
  },
  note: {
    type: DataTypes.TEXT
  }
});

// Define association
PortfolioApp.hasMany(Plan, { foreignKey: 'appId', onDelete: 'CASCADE' });
Plan.belongsTo(PortfolioApp, { foreignKey: 'appId' });

module.exports = Plan;

