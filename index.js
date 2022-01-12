require('dotenv').config()

const app = require('express')()
const db = require('./DAL')

app.use(require('./middlewares'))
app.use(require('./routes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`)
  await db.sequelize.sync()
})