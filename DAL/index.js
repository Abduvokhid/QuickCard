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
db.model_types = require('./ModelType')(sequelize)
db.model_items = require('./ModelItem')(sequelize)
db.records = require('./Record')(sequelize)
db.record_items = require('./RecordItem')(sequelize)

db.sessions.belongsTo(db.users, {
  as: 'user',
  foreignKey: 'user_id'
})

db.model_items.belongsTo(db.model_types, {
  as: 'model',
  foreignKey: 'model_id'
})

db.records.belongsTo(db.model_types, {
  as: 'model',
  foreignKey: 'model_id'
})

db.record_items.belongsTo(db.records, {
  as: 'record',
  foreignKey: 'record_id'
})

module.exports = db