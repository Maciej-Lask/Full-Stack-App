
const authMiddleware = (req, res, next) => {
  // console.log('authMiddleware');
  // console.log(req.session);
  if (req.session.login) {
    // console.log(req.session.login);
    next();
  } else {
    // console.log(req.session.login);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
