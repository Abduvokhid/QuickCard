const express = require('express')
const unflatten = require('unflatten')
const auth = require('../middlewares/auth')
const { model_types: ModelType, model_items: ModelItem } = require('../DAL')
const router = express.Router()

router.use(auth('moderator'))

// region ADD TEMPLATE
router.get('/add', (req, res) => {
  res.render('templates/new')
})

router.post('/add', async (req, res) => {
  const data = unflatten(req.body)
  const { title, slug, item: items } = data
  const model = await ModelType.create({
    name: title,
    slug: slug
  })

  for (const item of items) {
    const data = {
      model_id: model.id,
      name: item.name,
      type: item.key
    }
    if (['single_select', 'multi_select'].includes(item.key)) data.value = JSON.stringify(item.values.split(/[\r\n]+/))
    await ModelItem.create(data)
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

router.post('/:id/edit', async (req, res) => {
  const template = await ModelType.findOne({ where: { id: req.params.id }, include: 'items' })
  if (!template) return res.render('e404')

  const { title, slug, deleted, item: items } = unflatten(req.body)

  template.name = title
  template.slug = slug

  await template.save()

  for (const item of items) {
    if (!item) continue
    if (item.id) {
      const existingItem = template.items.find(i => i.id.toString() === item.id)
      if (existingItem) {
        existingItem.name = item.name
        if (['single_select', 'multi_select'].includes(item.key)) existingItem.value = JSON.stringify(item.values.split(/[\r\n]+/))
        await existingItem.save()
      }
    } else {
      const data = {
        model_id: template.id,
        name: item.name,
        type: item.key
      }
      if (['single_select', 'multi_select'].includes(item.key)) data.value = JSON.stringify(item.values.split(/[\r\n]+/))
      await ModelItem.create(data)
    }
  }

  await ModelItem.destroy({ where: { id: JSON.parse(deleted).map(i => parseInt(i)) } })

  res.redirect('/templates/' + req.params.id + '/edit')
})
// endregion

router.get('/', async (req, res) => {
  const templates = await ModelType.findAll()
  const success = req.getFlash('success')
  res.render('templates/index', { templates, success })
})

module.exports = router