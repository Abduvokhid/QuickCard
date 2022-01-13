const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('record', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING
  },
  edited_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
})