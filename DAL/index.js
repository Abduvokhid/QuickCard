const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  logging: false
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
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

db.model_types.hasMany(db.model_items, {
  as: 'items',
  foreignKey: 'model_id',
  onDelete: 'CASCADE'
})

db.records.belongsTo(db.users, {
  as: 'user',
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})

db.records.belongsTo(db.model_types, {
  as: 'model',
  foreignKey: 'model_id',
  onDelete: 'CASCADE'
})

db.records.hasMany(db.record_items, {
  as: 'items',
  foreignKey: 'record_id',
  onDelete: 'CASCADE'
})

db.record_items.belongsTo(db.model_items, {
  as: 'model_item',
  foreignKey: 'model_item_id',
  onDelete: 'CASCADE'
})

module.exports = db