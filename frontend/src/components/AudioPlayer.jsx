//src/components/AudioPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiDownload, FiFastForward, FiRefreshCw, FiVolumeX, FiVolume2 } from 'react-icons/fi';

const AudioPlayer = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const speedMenuRef = useRef(null);

  const playWithFallback = async () => {
    try {
      // Try to play the VoiceRSS audio first
      await audioRef.current.play();
    } catch (error) {
      // Fallback to browser TTS if audio playback fails
      if ('speechSynthesis' in window && title) {
        const utterance = new SpeechSynthesisUtterance(title);
        window.speechSynthesis.speak(utterance);
        
        // Update UI state for fallback playback
        setIsPlaying(true);
        utterance.onend = () => {
          setIsPlaying(false);
          setHasEnded(true);
          setProgress(100);
        };
      } else {
        alert('Audio playback failed - no support available');
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.load();
      setIsReady(false);
      setProgress(0);
      setCurrentTime('0:00');
      setDuration('0:00');
      setHasEnded(false);
    }
  }, [audioUrl]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = async () => {
    if (!isReady) return;

    try {
      if (hasEnded) {
        audioRef.current.currentTime = 0;
        setHasEnded(false);
      }

      if (isPlaying) {
        audioRef.current.pause();
        window.speechSynthesis.cancel();
      } else {
        await playWithFallback();
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleProgress = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
    setCurrentTime(formatTime(current));
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress((seekTime / audioRef.current.duration) * 100);
  };

  const handlePlaybackRate = (rate) => {
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      setDuration(formatTime(audio.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      setProgress(100);
    }

    audio.addEventListener('timeupdate', handleProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', () => setIsReady(true));
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      //audio.removeEventListener('loadedmetadata', handleLoadedData);
      audio.removeEventListener('canplay', () => setIsReady(true));
      audio.addEventListener('ended', handleEnded);
      window.speechSynthesis.cancel();
    };
  }, [audioUrl]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate px-1">
        {title || "Audio Preview"}
      </h3>
      {/* Progress timeline */}
      <div className="relative group mt-1">
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="h-1 bg-gray-200/80 dark:bg-gray-600/80 rounded-full cursor-pointer"
        >
          <div
            className="relative h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          >

            <div className="absolute right-0 -top-[3px] w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full shadow-sm transition-opacity opacity-0 group-hover:opacity-100" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1.5">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Controls container */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white transition-all"
          >
            {hasEnded ? (
              <FiRefreshCw className="w-4 h-4" />
            ) : isPlaying ? (
              <FiPause className="w-4 h-4" />
            ) : (
              <FiPlay className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className='p-1.5 rounded-lg bg-gradient-to-br from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 group'
          >
            {isMuted ? (
              <FiVolumeX className='w-5 h-5 transform group-hover:scale-110' />
            ) : (
              <FiVolume2 className='w-5 h-5 transform group-hover:scale-110' />
            )}
          </button>

          {/* Speed Control */}
          <div className="relative" ref={speedMenuRef}>
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FiFastForward className="w-3.5 h-3.5 transform -rotate-45" />
              <span className="text-sm font medium">{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-2 min-w-[120px] border border-white/20">
                  {[0.25, 0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRate(rate)}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg ${rate === playbackRate
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-600 dark:text-purple-400'
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                      } transition-colors `}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <FiDownload className="w-3.5 h-3.5" />
          <span className="text-sm">Download</span>
        </button>

        <audio
          key={audioUrl}
          ref={audioRef}
          preload='metadata'
          muted={isMuted}
          onError={(e) => console.error('Audio error', e.target.error)}
        >
          <source src={`${audioUrl}?t=${Date.now()}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div >
    </div>
  );
};

export default AudioPlayer;