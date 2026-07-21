const db = require('../db/database');

const saveEntry = (userId, feature, provider, input, output, metadata = {}) => {
  const createdAt = new Date().toISOString();
  const id = db.run(
    'INSERT INTO history (user_id, feature, provider, input, output, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, feature, provider || null, JSON.stringify(input), JSON.stringify(output), JSON.stringify(metadata), createdAt]
  );
  return { id, userId, feature, provider, input, output, metadata, createdAt };
};

const parseRow = (row) => ({
  id: row.id,
  feature: row.feature,
  provider: row.provider,
  input: JSON.parse(row.input),
  output: JSON.parse(row.output),
  metadata: row.metadata ? JSON.parse(row.metadata) : {},
  createdAt: row.created_at
});

const listEntries = (userId, feature) => {
  const rows = feature
    ? db.all('SELECT * FROM history WHERE user_id = ? AND feature = ? ORDER BY created_at DESC', [userId, feature])
    : db.all('SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows.map(parseRow);
};

const getEntry = (userId, id) => {
  const row = db.get('SELECT * FROM history WHERE id = ? AND user_id = ?', [id, userId]);
  return row ? parseRow(row) : null;
};

const deleteEntry = (userId, id) => {
  db.run('DELETE FROM history WHERE id = ? AND user_id = ?', [id, userId]);
};

module.exports = { saveEntry, listEntries, getEntry, deleteEntry };
