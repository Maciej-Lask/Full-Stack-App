const authMiddleware = (req, res, next) => {
  if (req.session.login) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
