require('dotenv').config()

const app = require('express')()
app.set('view engine', 'ejs')

app.use(require('./routes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`)
  await require('./DAL')()
})