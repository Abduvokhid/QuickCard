const express = require('express')
const auth = require('../middlewares/auth')
const {
  users: User,
  model_types: ModelType,
  model_items: ModelItem,
  records: Record,
  record_items: RecordItem
} = require('../DAL')
const router = express.Router({ mergeParams: true })

router.use(auth())

// region ADD RECORD
router.get('/add', async (req, res) => {
  const model = await ModelType.findOne({ where: { slug: req.params.slug }, include: 'items' })
  if (!model) return res.render('e404')
  res.render('models/new', { model, items: model.items })
})

router.post('/add', async (req, res) => {
  const model = await ModelType.findOne({ where: { slug: req.params.slug }, include: 'items' })
  if (!model) return res.render('e404')

  const { title } = req.body

  const record = await Record.create({
    title: title,
    model_id: model.id,
    user_id: req.user.id
  })

  const item_ids = []
  const item_types = []
  model.items.forEach((item) => {
    item_ids.push(item.id)
    item_types.push(item.type)
  })

  for (const bodyKey in req.body) {
    const parts = bodyKey.split('_')
    if (!parts[1]) continue

    const id = parseInt(parts[1])
    const index = item_ids.findIndex(i => i === id)
    if (index < 0) continue

    const type = item_types[index]

    const record_item = await RecordItem.create({
      record_id: record.id,
      model_item_id: id,
      value: type === 'multi_select' ? JSON.stringify(req.body[bodyKey]) : req.body[bodyKey]
    })
  }

  res.redirect(`/${model.slug}`)
})
// endregion

// region SHOW RECORD
router.get('/:id', async (req, res) => {
  const model = await ModelType.findOne({ where: { slug: req.params.slug } })
  if (!model) return res.render('e404')
  const record = await Record.findOne({
    where: { id: req.params.id, model_id: model.id },
    attributes: { exclude: ['model_id', 'user_id'] },
    include: [{
      model: RecordItem,
      as: 'items',
      attributes: { exclude: ['record_id', 'model_item_id'] },
      include: {
        model: ModelItem,
        as: 'model_item',
        attributes: { exclude: ['created_date', 'model_id'] }
      }
    }, {
      model: User,
      as: 'user',
      attributes: { exclude: ['email', 'password', 'role', 'created_date', 'last_access_date'] },
    }]
  })
  res.render('models/show', { model, record })
})
// endregion

router.get('/', async (req, res) => {
  const model = await ModelType.findOne({ where: { slug: req.params.slug } })
  if (!model) return res.render('e404')
  const records = await Record.findAll({ where: { model_id: model.id } })
  res.render('models/index', { model, records })
})

module.exports = router