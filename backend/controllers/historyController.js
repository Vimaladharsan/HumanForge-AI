const historyService = require('../services/historyService');

const list = (req, res) => {
  try {
    const { feature } = req.query;
    const entries = historyService.listEntries(req.user.id, feature);
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOne = (req, res) => {
  try {
    const entry = historyService.getEntry(req.user.id, Number(req.params.id));
    if (!entry) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const remove = (req, res) => {
  try {
    historyService.deleteEntry(req.user.id, Number(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { list, getOne, remove };
