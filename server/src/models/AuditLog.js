const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entityType: {
    type: DataTypes.STRING, // 'App', 'Plan'
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING, // 'CREATE', 'UPDATE', 'DELETE'
    allowNull: false
  },
  changedBy: {
    type: DataTypes.STRING, // User name/ID
    defaultValue: 'System'
  },
  changes: {
    type: DataTypes.JSON // Previous and new values
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = AuditLog;

