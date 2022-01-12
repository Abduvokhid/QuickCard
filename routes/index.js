const express = require('express')
const router = express.Router()

router.use('/users', require('./users'))
router.use('/', require('./home'))
router.use((req, res) => {
  console.log(req.method, req.path)
  return res.json({error: '404 Method not found'})
})

module.exports = router