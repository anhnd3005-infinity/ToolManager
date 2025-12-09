const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PortfolioApp = sequelize.define('PortfolioApp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monthOrder: {
    type: DataTypes.STRING // Format: YYYY-MM
  },
  priority: {
    type: DataTypes.STRING // 1, 2, 3...
  },
  type: {
    type: DataTypes.STRING // New, Reskin, Optimize...
  },
  executor: {
    type: DataTypes.STRING // Inhouse, Partner...
  },
  link: {
    type: DataTypes.STRING
  },
  referenceApp: {
    type: DataTypes.TEXT // Prefer/Benchmark apps
  },
  updateIssue: {
    type: DataTypes.TEXT
  },
  requestInfo: {
    type: DataTypes.TEXT
  },
  retention: {
    type: DataTypes.JSON // { d1: 10, d7: 5, d30: 2 }
  },
  volume: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Research' // Research, Idea, Develop, Ready, Live, Pause, Stop
  },
  strategy: {
    type: DataTypes.TEXT
  },
  store: {
    type: DataTypes.STRING // Google Play, App Store...
  },
  category: {
    type: DataTypes.STRING
  },
  group: {
    type: DataTypes.STRING // Campaign tags
  },
  startDate: {
    type: DataTypes.DATEONLY
  },
  releaseDate: {
    type: DataTypes.DATEONLY
  },
  owner: {
    type: DataTypes.STRING
  }
});

module.exports = PortfolioApp;

