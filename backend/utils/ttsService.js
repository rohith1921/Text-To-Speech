const axios = require("axios");
const fs = require('fs');
const { supabase } = require("../config/supabase");
const { voiceRssKey } = require("../config/db");


const convertTextToSpeech = async (text, voice) => {
  try {
    // 1. Get audio content from VoiceRSS
    const response = await axios.get(
      `https://api.voicerss.org/?key=${voiceRssKey}&hl=${voice}&src=${encodeURIComponent(text)}&c=MP3`,
      {
        responseType: "arraybuffer",
        validateStatus: (status) => status === 200
      }
    );

    if (!text || text.trim() === "") {
      throw new Error("Text input is empty");
    }

    if (!response.headers['content-type']?.includes('audio/mpeg')) {
      const errorMessage = Buffer.from(response.data).toString('utf-8');
      throw new Error(`VoiceRSS Error: ${errorMessage}`);
    }

    if (!response.data || response.data.byteLength < 1024) {
      console.log('VoiceRSS Response:', response.status, response.headers);
      throw new Error('Invalid audio data received from VoiceRSS');
    }

    //console.log('Test audio file saved');


    // 2. Upload to Supabase Storage
    const fileName = `audio_${Date.now()}.mp3`;
    const { error: storageError } = await supabase.storage
      .from("audiofiles")
      .upload(fileName, response.data, {
        contentType: 'audio/mpeg'
      });

    if (storageError) {
      console.error("Supabase Upload Error:", storageError);
      throw new Error("File upload failed: " + storageError.message);
    }

    // 3. Get public URL
    const {
      data: { publicUrl },
    } = await supabase.storage.from("audiofiles").getPublicUrl(fileName + `?t=${Date.now()}`);

    if (!publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    //console.log("Generated URL:", publicUrl);
    return publicUrl;

  } catch (error) {
    console.error("Full conversion Error:", error);
    throw new Error("Audio generation failed: " + error.message);
  }
};

module.exports = { convertTextToSpeech };
