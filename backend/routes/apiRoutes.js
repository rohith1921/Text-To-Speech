// server/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');
const audioController = require('../controllers/audioController');
const { getDailyQuota } = require('../config/db');
const authenticateUser = require('../middleware/auth');

router.post('/text-to-speech', authenticateUser, ttsController.convert);
router.get('/audio-files', authenticateUser, ttsController.listFiles);
router.delete('/audio-files/:id', authenticateUser, audioController.deleteAudioFile);
router.get('/user-quota', authenticateUser, async (req, res) => {
    try {
      const quota = await getDailyQuota(req.user.id);
      if (!quota) throw new Error('Quota not found');
      res.json({
        conversions_today: quota.conversions_today,
        remaining: 30 - quota.conversions_today
      });
    } catch (error) {
      if (error.message.includes('permission denied')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }
      res.status(500).json({ error: 'Failed to fetch quota' });
    }
});

module.exports = router;