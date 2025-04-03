// server/controllers/audioController.js
const AudioFile = require("../models/AudioFile");
const { supabase } = require("../config/supabase");

exports.getAudioFiles = async (req, res) => {
  try {
    const audioFiles = await AudioFile.getAll();
    res.json(audioFiles);
  } catch (error) {
    console.error("Error fetching audio files:", error);
    res.status(500).json({ error: "Failed to fetch audio files" });
  }
};

exports.deleteAudioFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: fileData, error: fetchError } = await supabase
      .from("audio_files")
      .select("audio_url")
      .eq("id", id)
      .eq('user_id', userId)
      .single();

      if (fetchError || !fileData) {
        return res.status(404).json({ error: 'File not found or access denied' });
      }

    const url = new URL(fileData.audio_url);
    const pathSegments = url.pathname.split("/");
    const audioFilesIndex = pathSegments.indexOf('audiofiles');

    if (audioFilesIndex === -1) {
      throw new Error("Invalid audio URL format");
    }

    const storagepath = pathSegments.slice(audioFilesIndex + 1).join('/');

    const { error: storageError } = await supabase.storage
      .from("audiofiles")
      .remove([storagepath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      throw new Error('Failed to delete audio file from storage');
    }

    const { error: dbError } = await supabase
      .from("audio_files")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete audio file" });
  }
};
