const express = require('express')
const auth = require('../middlewares/auth')
const { model_types: ModelType } = require('../DAL')
const router = express.Router()

router.use(auth('moderator'))

router.get('/add', async (req, res) => {
  res.render('templates/new')
})

router.get('/', async (req, res) => {
  const templates = await ModelType.findAll()
  res.render('templates/index', { templates })
})

module.exports = router