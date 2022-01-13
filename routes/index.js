const express = require('express')
const router = express.Router()

router.use('/users', require('./users'))
router.use('/templates', require('./templates'))
router.use('/settings', require('./settings'))
router.use('/', require('./home'))
router.use('/:slug', require('./models'))
router.use((req, res) => {
  console.log(req.method, req.path)
  return res.render('e404')
})

module.exports = router