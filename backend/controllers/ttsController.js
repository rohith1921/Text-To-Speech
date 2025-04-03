// server/controllers/ttsController.js
const crypto = require('crypto');
const axios = require('axios');
const { supabase, getDailyQuota } = require('../config/db');
const { voiceRssKey } = require('../config/db');
const AudioFile = require('../models/AudioFile');

exports.convert = async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { text, language, voice } = req.body;

      if (!text?.trim() || text.length > 1030) {
        return res.status(400).json({ error: "Text exceeds 1030 character limit" });
      }

      const quota = await getDailyQuota(userId);
      if (quota.conversions_today >= 30) {
        return res.status(429).json({ error: "Daily limit reached (30 conversions)" });
      }

      const textHash = crypto.createHash('md5')
      .update(text.trim() + language + (voice || ''))
      .digest('hex');

      if (!text || !language) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data: existing } = await supabase
      .from('audio_files')
      .select('id, audio_url')
      .eq('text_hash', textHash)
      .eq('user_id', userId)
      .limit(1);

      if (existing.length > 0) {
        return res.json(existing[0]);
      }

      // VoiceRSS API call
      const response = await axios.get(
        `https://api.voicerss.org/?key=${voiceRssKey}&hl=${language}&src=${encodeURIComponent(text)}&c=MP3&f=24khz_16bit_stereo${voice ? `&v=${voice}` : ''}`,
        { responseType: "arraybuffer" }
      );

      // Validate audio response
      if (!response.headers['content-type']?.includes('audio/mpeg')) {
        const errorMessage = Buffer.from(response.data).toString('utf-8');
        throw new Error(errorMessage.replace('ERROR: ', ''));
      }

      // Upload to Supabase Storage
      const fileName = `audio_${Date.now()}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from("audiofiles")
        .upload(`${req.user.id}/${fileName}`, response.data, {
          contentType: 'audio/mpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("audiofiles")
        .getPublicUrl(`${req.user.id}/${fileName}`);

      await supabase
        .from('user_quotas')
        .update({ conversions_today: quota.conversions_today + 1 })
        .eq('user_id', userId);

      // Save to database
      const newAudio = await AudioFile.create({
        text,
        audio_url: publicUrl,
        user_id: req.user.id,
        text_hash: textHash
      });

      res.json(newAudio);
    } catch (error) {
      console.error("Conversion error:", error);
      res.status(500).json({ 
        error: error.message || "Audio generation failed" 
      });
    }
};

exports.listFiles = async (req, res) => {
    try {
      const files = await AudioFile.getAll(req.user.id);
      res.json(files);
    } catch (error) {
      console.error('List files error:', error);
      res.status(500).json({ error: 'Failed to fetch audio files' });
    }
};