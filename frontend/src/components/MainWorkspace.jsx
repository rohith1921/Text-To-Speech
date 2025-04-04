//src/components/MainWorkspace.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import AudioPlayer from './AudioPlayer';
import { useAuth } from '../context/AuthContext';
import { supabase } from './supabaseClient';
import { ErrorBoundary } from './ErrorBoundary';

const MainWorkspace = ({ onNewConversion, selectedAudio, onSelectedAudio, onNewChat }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('en-us');
  const [selectedVoiceName, setSelectedVoiceName] = useState('Linda');
  const [quota, setQuota] = useState({ used: 0, remaining: 30 });
  const [charCount, setCharCount] = useState(0);
  const { darkMode } = useTheme();
  const { user } = useAuth();

  const VOICE_OPTIONS = [
    // English Variants
    {
      value: 'en-us', label: 'English (US)', voice: 'Linda', voices: [
        { value: 'Linda', label: 'Linda (Female)' },
        { value: 'Amy', label: 'Amy (Female)' },
        { value: 'Mary', label: 'Mary (Female)' },
        { value: 'John', label: 'John (Male)' }
      ]
    },
    {
      value: 'en-gb', label: 'English (UK)', voice: 'Alice', voices: [
        { value: 'Alice', label: 'Alice (Female)' },
        { value: 'Nancy', label: 'Nancy (Female)' },
        { value: 'Harry', label: 'Harry (Male)' }
      ]
    },

    // Indian Languages
    {
      value: 'hi-in', label: 'Hindi (India)', voice: 'Puja', voices: [
        { value: 'Puja', label: 'Puja (Female)' },
        { value: 'Kabir', label: 'Kabir (Male)' }
      ]
    },
    {
      value: 'ta-in', label: 'Tamil (India)', voice: 'Sai', voices: [
        { value: 'Sai', label: 'Sai (Male)' }
      ]
    },

    // European Languages
    {
      value: 'es-es', label: 'Spanish (Spain)', voice: 'Camila', voices: [
        { value: 'Camila', label: 'Camila (Female)' },
        { value: 'Diego', label: 'Diego (Male)' }
      ]
    },
    {
      value: 'fr-fr', label: 'French (France)', voice: 'Bette', voices: [
        { value: 'Bette', label: 'Bette (Female)' },
        { value: 'Axel', label: 'Axel (Male)' }
      ]
    },
    {
      value: 'de-de', label: 'German (Germany)', voice: 'Hanna', voices: [
        { value: 'Hanna', label: 'Hanna (Female)' },
        { value: 'Jonas', label: 'Jonas (Male)' }
      ]
    },
    {
      value: 'it-it', label: 'Italian (Italy)', voice: 'Bria', voices: [
        { value: 'Bria', label: 'Bria (Female)' },
        { value: 'Pietro', label: 'Pietro (Male)' }
      ]
    },

    // Asian Languages
    {
      value: 'ru-ru', label: 'Russian (Russia)', voice: 'Olga', voices: [
        { value: 'Olga', label: 'Olga (Female)' },
        { value: 'Peter', label: 'Peter (Male)' }
      ]
    },
    {
      value: 'ja-jp', label: 'Japanese (Japan)', voice: 'Hina', voices: [
        { value: 'Hina', label: 'Hina (Female)' },
        { value: 'Akira', label: 'Akira (Male)' }
      ]
    },
    {
      value: 'zh-cn', label: 'Chinese (China)', voice: 'Luli', voices: [
        { value: 'Luli', label: 'Luli (Female)' },
        { value: 'Wang', label: 'Wang (Male)' }
      ]
    },
    {
      value: 'ko-kr', label: 'Korean (Korea)', voice: 'Nari', voices: [
        { value: 'Nari', label: 'Nari (Female)' }
      ]
    },

    // Middle Eastern
    {
      value: 'ar-eg', label: 'Arabic (Egypt)', voice: 'Oda', voices: [
        { value: 'Oda', label: 'Oda (Female)' }
      ]
    },

    // Other Important
    {
      value: 'pt-pt', label: 'Portuguese (Portugal)', voice: 'Leonor', voices: [
        { value: 'Leonor', label: 'Leonor (Female)' }
      ]
    },
    {
      value: 'nl-nl', label: 'Dutch (Netherlands)', voice: 'Lotte', voices: [
        { value: 'Lotte', label: 'Lotte (Female)' }
      ]
    }
  ];

  const currentLanguage = VOICE_OPTIONS.find(opt => opt.value === selectedVoice);

  useEffect(() => {
    if (onNewChat) {
      setText('');
    }
  }, [onNewChat]);

    const fetchQuota = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const response = await axios.get('https://text-to-speech-backend-bvu4.onrender.com/api/user-quota', {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          setQuota({
            used: response.data.conversions_today,
            remaining: 30 - response.data.conversions_today
          });
        }
      } catch (error) {
        console.error('Error fetching quota:', error);
      }
    };

    useEffect(() => {
      if (user) {
        fetchQuota();
        const interval = setInterval(fetchQuota, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
      }
    }, [user, selectedAudio]);

    useEffect(() => {
      setCharCount(text.length);
    },[text]);

  const handleConvert = async () => {
    if (!text.trim() || text.length > 1000) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.post('https://text-to-speech-backend-bvu4.onrender.com/api/text-to-speech', {
        text: text.trim(),
        language: selectedVoice,
        voice: selectedVoiceName
      },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      if (!response.data.audio_url) {
        throw new Error('No audio URL returned');
      }

      // Update local state first for immediate feedback
      setQuota(prev => ({
        used: prev.used + 1,
        remaining: prev.remaining - 1
      }));

      const newAudio = response.data;
      onSelectedAudio(newAudio);
      onNewConversion(newAudio);
      setText('');
     
      await fetchQuota();

    } catch (error) {
      console.error('Conversion error:', error);
      setQuota(prev => ({
        used: Math.max(0, prev.used - 1),
        remaining: Math.min(30, prev.remaining + 1)
      }));
      alert(error.response?.data?.error || error.message || 'Conversion failed. check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex-1 p-6 bg-background-light dark:bg-background-dark">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert..."
                className="w-full h-48 p-4 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
                  maxLength={1030}
              />

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Language
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      const lang = VOICE_OPTIONS.find(opt => opt.value === e.target.value);
                      setSelectedVoiceName(lang.voice);
                    }}
                    className="w-full px-4 py-2 border rounded-lg bg-surface-light dark:bg-surface-dark
                  border-gray-300 dark:border-gray-600
                  text-text-primary-light dark:text-text-primary-dark"
                  >
                    {VOICE_OPTIONS.map((voice) => (
                      <option key={voice.value} value={voice.value}>
                        {voice.label}
                      </option>
                    ))}
                  </select>
                </div>
                {currentLanguage.voices.length > 1 && (
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Voice
                    </label>
                    <select
                      value={selectedVoiceName}
                      onChange={(e) => setSelectedVoiceName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-surface-light dark:bg-surface-dark border-gray-300 dark:border-gray-600 text-text-primary-light dark:text-text-primary-dark"
                    >
                      {currentLanguage.voices.map((voice) => (
                        <option key={voice.value} value={voice.value}>
                          {voice.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {charCount}/1030 characters
                </div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  Conversion today: {quota.used}/30
                  {quota.remaining <= 5 && (
                    <span className="ml-1 text-red-500">({quota.remaining} left)</span>
                  )}
                </div>

                <button
                  onClick={handleConvert}
                  disabled={loading || !text.trim() || quota.remaining <= 0}
                  className={`px-6 py-3 rounded-lg font-medium text-white ${quota.remaining <= 0 ? 'bg-red-500' : (loading || !text.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    } transition-all`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Converting...
                    </span>
                  ) : (
                    'Generate Speech'
                  )}
                </button>
              </div>
            </div>

            {selectedAudio && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <AudioPlayer
                  audioUrl={`${selectedAudio.audio_url}?${Date.now()}`}
                  title={selectedAudio.text}
                  key={selectedAudio.audio_url}
                />
              </div>
            )}
          </div>
        </div>
      </div >
    </ErrorBoundary >
  );
};

export default MainWorkspace;
