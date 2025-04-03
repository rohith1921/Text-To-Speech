const { supabase } = require('../config/db');
const cron = require('node-cron');

async function cleanupOldFiles() {
  // Delete files older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Database cleanup
  const { data: oldFiles } = await supabase
    .from('audio_files')
    .select('audio_url')
    .lt('created_at', thirtyDaysAgo.toISOString());

  // Storage cleanup
  const pathsToDelete = oldFiles.map(file => {
    const url = new URL(file.audio_url);
    return url.pathname.split('/').slice(3).join('/'); // Extract storage path
  });

  if (pathsToDelete.length > 0) {
    await supabase.storage
      .from('audiofiles')
      .remove(pathsToDelete);
  }

  console.log(`Cleaned up ${pathsToDelete.length} old files`);
}

// Run daily at 2 AM
cron.schedule('0 2 * * *', cleanupOldFiles);