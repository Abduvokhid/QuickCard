const express = require('express')
const bcrypt = require('bcrypt')
const sha1 = require('sha1')
const auth = require('../middlewares/auth')
const { users: User, sessions: Session } = require('../DAL')

const router = express.Router()

router.get('/', auth(), (req, res) => {
  res.render('home/index')
})

router.post('/register', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body
  const p = await bcrypt.hash(password, 10)
  const user = User.build({
    name,
    email,
    password: p,
    role
  })
  await user.save()
  res.json(user.dataValues)
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email: email } })
  if (!user) {
    res.cookie('error', 'Неправильный логин или пароль')
    return res.redirect('/login')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    res.cookie('error', 'Неправильный логин или пароль')
    return res.redirect('/login')
  }

  const sid = sha1(`${user.id}-${Date.now()}`)

  const session = Session.build({
    sid: sid,
    expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
    user_id: user.id,
    user_agent: req.user_agent
  })
  await session.save()
  res.cookie('sid', sid)
  res.redirect('/')
})

router.get('/login', (req, res) => {
  const error = req.cookies.error
  res.cookie('error', '', { maxAge: 0 })
  res.render('login', { layout: false, error })
})

router.post('/logout', auth(), async (req, res) => {
  await Session.destroy({ where: { id: req.session.id } })
  res.cookie('sid', '', { maxAge: 0 })
  res.redirect('/login')
})

module.exports = router