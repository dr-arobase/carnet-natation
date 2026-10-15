const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'monsecret';

function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token manquant' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Accès refusé' });
    next();
  };
}

module.exports = { authenticateJWT, authorizeRole };
