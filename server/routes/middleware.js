const requireAuth = (req, res, next) => (!req.user ? res.status(401).send({ message: 'Organization not authenticated' }) : next());

module.exports = { requireAuth };
