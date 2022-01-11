require('dotenv').config()

const app = require('express')()
const db = require('./DAL')
const expressSession = require('express-session')
const SessionStore = require('connect-session-sequelize')(expressSession.Store)

app.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SessionStore({
    db: db.sequelize,
  })
}))

app.use(require('./middlewares'))
app.use(require('./routes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`)
  await db.sequelize.sync()
})