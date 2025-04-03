//models/AudioFile.js
const { supabase } = require("../config/supabase");

class AudioFile {
  static async create({ text, audio_url, user_id }) {
    try {
      const { data, error } = await supabase
        .from("audio_files")
        .insert([
          {
            text,
            audio_url,
            user_id,
            created_at: new Date().toISOString(),
          },
        ])
        .select("*");

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Database Insert Error:", error);
      throw new Error("Failed to save audio record: " + error.message);
    }
  }

  static async getAll(userId) {
    //const test = await supabase.from('audio_files').select('*').limit(1);
    //console.log('Supabase Test Result:', test);
    try {
      const { data, error } = await supabase
        .from("audio_files")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Database Fetch Error:", error);
      throw new Error("Failed to fetch audio files:" + error.message);
    }
  }
}

module.exports = AudioFile;
