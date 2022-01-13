const express = require('express')
const auth = require('../middlewares/auth')
const { users: User } = require('../DAL')
const bcrypt = require('bcrypt')

const router = express.Router()

router.use(auth('moderator'))

// region ADD USER
router.get('/add', (req, res) => {
  res.render('users/new')
})

router.post('/add', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = User.build({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role
  })
  await user.save()
  req.setFlash('success', `${name} успешно добавлен`)
  res.redirect('/users')
})
// endregion

// region EDIT USER
router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ where: { id: id } })
  if (!user) return res.render('e404')
  res.render('users/edit', { selectedUser: user })
})

router.post('/:id/edit', async (req, res) => {
  const id = req.params.id
  const { name, email, password, role } = req.body

  const user = await User.findOne({ where: { id: id } })
  if (!user) return res.render('e404')

  const updatable = {
    name,
    email: email.toLowerCase(),
    role
  }
  if (password !== '') updatable.password = await bcrypt.hash(password, 10)

  await User.update(updatable, { where: { id: id } })
  req.setFlash('success', `${user.name} успешно редактирован`)

  res.redirect(`/users`)
})
// endregion

// region DELETE USER
router.get('/:id/delete', async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ where: { id: id } })
  if (!user) return res.render('e404')
  res.render('users/delete', { selectedUser: user })
})

router.post('/:id/delete', async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ where: { id: id } })
  if (!user) return res.render('e404')
  await User.destroy({ where: { id: id } })
  req.setFlash('success', `${user.name} успешно удален`)
  res.redirect('/users')
})
// endregion

router.get('/', async (req, res) => {
  const users = await User.findAll()
  const success = req.getFlash('success')
  res.render('users/index', { users, success })
})

module.exports = router