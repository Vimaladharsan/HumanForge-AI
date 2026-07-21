const authService = require('../services/authService');

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' ? token : null;
};

// Rejects the request if no valid token is present
const requireAuth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  try {
    req.user = authService.verifyToken(token);
    if (!req.user) throw new Error('User not found');
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Attaches req.user if a valid token is present, but never blocks the request
const optionalAuth = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = authService.verifyToken(token);
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
