module.exports = (req, res, next) => {

  req.setFlash = (type, message) => {
    res.cookie(type, message)
  }

  req.getFlash = (type) => {
    const message = req.cookies[type]
    res.cookie(type, '', { maxAge: 0 })
    return message
  }

  next()
}