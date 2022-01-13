const express = require('express')
const bcrypt = require('bcrypt')
const { users: User } = require('../DAL')
const router = express.Router()

router.get('/', (req, res) => {
  const success = req.getFlash('success')
  res.render('settings/index', {success})
})

router.post('/', async (req, res) => {
  const { name, email, password } = req.body

  const updatable = {
    name,
    email: email.toLowerCase()
  }
  if (password !== '') updatable.password = await bcrypt.hash(password, 10)

  await User.update(updatable, { where: { id: req.user.id } })
  req.setFlash('success', `Ваш аккаунт успешно редактирован`)

  res.redirect('/settings')
})

module.exports = router