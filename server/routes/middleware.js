const requireAuth = (req, res, next) => (!req.user ? res.status(401).send({ ok: false, msg: 'Organization not authenticated' }) : next());

const hasReadAccessForCollection = (req, res, next) => {
  if (!req.query.readKey && !req.query.masterKey) return res.status(403).json({ ok: false, msg: 'No key credentials sent!' });
  if (!req.query.event_collection) return res.status(400).json({ ok: false, msg: 'No `event_collection` param provided!' });
  return next();
};

const hasWriteAccess = (req, res, next) => ((!req.query.writeKey && !req.query.masterKey)
  ? res.status(403).json({ ok: false, msg: 'No key credentials sent!' })
  : next());

module.exports = { requireAuth, hasReadAccessForCollection, hasWriteAccess };
