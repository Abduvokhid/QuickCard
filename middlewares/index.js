const express = require('express')
const cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts')
const nl2br = require('nl2br')
const { sessions: Session, users: User } = require('../DAL')

const router = express.Router()

router.use((req, res, next) => {
  req.app.set('view engine', 'ejs')
  next()
})

router.use(expressLayouts)
router.use(express.static('public'))
router.use(express.urlencoded({ extended: false }))
router.use(cookieParser(process.env.COOKIE_SECRET))

router.use((req, res, next) => {
  req.app.locals.path = req.path
  res.locals.path = req.path
  res.locals.nl2br = nl2br
  req.user_agent = req.get('User-Agent')
  next()
})

router.use(async (req, res, next) => {
  const sid = req.cookies.sid
  if (!sid) return next()

  const session = await Session.findOne({ include: 'user', where: { sid: sid } })
  if (!session) return next()
  if (!session.user) return next()

  req.session = session
  req.user = session.user
  res.locals.user = session.user

  return next()
})

module.exports = router
