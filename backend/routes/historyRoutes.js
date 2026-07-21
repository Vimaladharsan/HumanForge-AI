const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', historyController.list);
router.get('/:id', historyController.getOne);
router.delete('/:id', historyController.remove);

module.exports = router;
