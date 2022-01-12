module.exports = auth = (role = 'user') => (req, res, next) => {
  const error = () => res.redirect('/')
  if (!req.user) return res.redirect('/login')
  switch (role) {
    case 'admin':
      if (req.user.role === 'admin') return next()
      else return error()
    case 'moderator':
      if (['admin', 'moderator'].includes(req.user.role)) return next()
      else return error()
    case 'user':
    default:
      if (['admin', 'moderator', 'user'].includes(req.user.role)) return next()
      else return error()
  }
}