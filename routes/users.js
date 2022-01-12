const express = require('express')
const auth = require('../middlewares/auth')
const { users: User } = require('../DAL')
const bcrypt = require('bcrypt')

const router = express.Router()

router.use(auth('moderator'))

router.get('/add', (req, res) => {
  res.render('users/new')
})

router.post('/add', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = User.build({
    name,
    email,
    password: hashedPassword,
    role
  })
  await user.save()
  res.cookie('success', 'Пользователь успешно добавлен')
  res.redirect('/users')
})

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
    email,
    role
  }
  if (password !== '') updatable.password = await bcrypt.hash(password, 10)

  await User.update(updatable, { where: { id: id } })

  res.redirect(`/users`)
})

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.render('users/index', { users })
})

module.exports = router