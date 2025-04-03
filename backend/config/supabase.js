// server/config/supabase.js
const { supabase } = require("./db");

supabase.storage = supabase.storage;

async function cleanupOldFiles() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: oldFiles, error } = await supabase
    .from("audio_files")
    .select("audio_url")
    .lt("created_at", thirtyDaysAgo.toISOString());

  if (error) {
    console.error("Database cleanup error:", error);
    return;
  }

  const pathsToDelete = oldFiles.map((file) => {
    const url = new URL(file.audio_url);
    const pathParts = url.pathname.split("/");
    const audioIndex = pathParts.indexOf("audiofiles");
    return pathParts.slice(audioIndex + 1).join("/");
  });

  if (pathsToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("audiofiles")
      .remove(pathsToDelete);

    if (!storageError) {
      await supabase
        .from("audio_files")
        .delete()
        .lt("created_at", thirtyDaysAgo.toISOString());
    }
  }
  console.log(`Cleaned up ${pathsToDelete.length} old files`);
}

module.exports = { supabase, cleanupOldFiles };
