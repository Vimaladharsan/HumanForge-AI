const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '7d';

const toPublicUser = (user) => ({ id: user.id, email: user.email, name: user.name });

const register = async (email, password, name) => {
  const existing = db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const createdAt = new Date().toISOString();
  const userId = db.run(
    'INSERT INTO users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)',
    [email, passwordHash, name, createdAt]
  );

  const user = { id: userId, email, name };
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { user: toPublicUser(user), token };
};

const login = async (email, password) => {
  const user = db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { user: toPublicUser(user), token };
};

const verifyToken = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  const user = db.get('SELECT * FROM users WHERE id = ?', [payload.userId]);
  if (!user) return null;
  return toPublicUser(user);
};

const getUserById = (userId) => {
  const user = db.get('SELECT * FROM users WHERE id = ?', [userId]);
  return user ? toPublicUser(user) : null;
};

module.exports = { register, login, verifyToken, getUserById };
