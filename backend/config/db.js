//server/config/db
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Supabase credentials missing in .env file');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Add quota methods
const getDailyQuota = async (userId) => {
  const { data, error } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    await supabase
      .from('user_quotas')
      .insert([{ user_id: userId }]);
    return { conversions_today: 0 };
  }
  
  // Reset counter if new day
  if (new Date(data.last_reset_date).toDateString() !== new Date().toDateString()) {
    await supabase
      .from('user_quotas')
      .update({ conversions_today: 0, last_reset_date: new Date() })
      .eq('user_id', userId);
    return { conversions_today: 0 };
  }
  
  return data;
};

module.exports = { supabase, getDailyQuota, voiceRssKey: process.env.VOICERSS_API_KEY };