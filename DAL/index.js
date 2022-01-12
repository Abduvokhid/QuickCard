const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./User')(sequelize)
db.sessions = require('./Session')(sequelize)

// db.users.hasMany(db.sessions)
db.sessions.belongsTo(db.users, {
  as: 'user',
  foreignKey: 'user_id'
})

module.exports = db