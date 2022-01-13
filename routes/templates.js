const express = require('express')
const auth = require('../middlewares/auth')
const { model_types: ModelType, model_items: ModelItem } = require('../DAL')
const router = express.Router()

router.use(auth('moderator'))

// region ADD TEMPLATE
router.get('/add', (req, res) => {
  res.render('templates/new')
})

router.post('/add', async (req, res) => {
  const { title, slug } = req.body
  const model = await ModelType.create({
    name: title,
    slug: slug
  })

  for (const bodyKey in req.body) {
    const keyParts = bodyKey.split('.')
    if (keyParts[2] && keyParts[2] === 'key') {
      const key = req.body[`${keyParts[0]}.${keyParts[1]}.key`]
      const name = req.body[`${keyParts[0]}.${keyParts[1]}.name`]
      const data = {
        model_id: model.id,
        name: name,
        type: key
      }
      if (['single_select', 'multi_select'].includes(key)) {
        const values = req.body[`${keyParts[0]}.${keyParts[1]}.values`].split(/[\r\n]+/)
        data.value = JSON.stringify(values)
      }
      const item = await ModelItem.create(data)
      console.log(item.dataValues)
    }
  }

  req.setFlash('success', `${title} успешно добавлен`)
  res.redirect('/templates')
})
// endregion

// region DELETE TEMPLATE
router.get('/:id/delete', async (req, res) => {
  const template = await ModelType.findOne({ where: { id: req.params.id } })
  if (!template) return res.render('e404')
  res.render('templates/delete', { template })
})

router.post('/:id/delete', async (req, res) => {
  const template = await ModelType.findOne({ where: { id: req.params.id } })
  if (!template) return res.render('e404')
  await ModelType.destroy({ where: { id: req.params.id } })
  res.redirect('/templates')
})
// endregion

// region EDIT TEMPLATE
router.get('/:id/edit', async (req, res) => {
  const template = await ModelType.findOne({ where: { id: req.params.id }, include: 'items' })
  if (!template) return res.render('e404')
  res.render('templates/edit', { template })
})
// endregion

router.get('/', async (req, res) => {
  const templates = await ModelType.findAll()
  const success = req.getFlash('success')
  res.render('templates/index', { templates, success })
})

module.exports = router