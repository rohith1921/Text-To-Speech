// Updated App.js
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MainWorkspace from './components/MainWorkspace';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import ConfirmationSuccess from './components/ConfirmationSucess';
import ConfirmationPrompt from './components/ConfirmationPrompt';
import { supabase } from './components/supabaseClient';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<AuthPage type="login" />} />
              <Route path="/signup" element={<AuthPage type="signup" />} />
              <Route path='/confirmation-prompt' element={<ConfirmationPrompt />} />
              <Route path="/confirm-success" element={<ConfirmationSuccess /> } />
              <Route path="/" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

const MainApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const userHasToggled = useRef(false);
  const [loadingFiles, setLoadingFiles] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (!userHasToggled.current) {
        // Auto-show/hide only if user never toggled
        setIsSidebarOpen(window.innerWidth >= 768);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      setLoadingFiles(true);
      try {
        const response = await axios.get('https://text-to-speech-backend-bvu4.onrender.com/api/audio-files');
        setAudioFiles(response.data);
      } catch (error) {
        console.error('Error fetching audio files:', error);
        setAudioFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };
    fetchAudioFiles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const response = await axios.get(
            'https://text-to-speech-backend-bvu4.onrender.com/api/audio-files',
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            }
          );
          setAudioFiles(response.data);
        }
      } catch (error) {
        console.error('Initial load error:', error);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
    userHasToggled.current = true;
  };

  const handleNewConversion = (newAudio) => {
    if (newAudio?.audio_url) {
      setAudioFiles(prev => [newAudio, ...prev])
      setSelectedAudio(newAudio)  // Force immediate update
    }
  }

  const handleNewChat = () => {
    setSelectedAudio(null);
    document.querySelector('textarea').value = '';
  };

  const handleDeleteAudio = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await axios.delete(`https://text-to-speech-backend-bvu4.onrender.com/api/audio-files/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      if (response.data.success) {
        setAudioFiles(prev => prev.filter(file => file.id !== id));
        if (selectedAudio?.id === id) setSelectedAudio(null);
      }

      setAudioFiles(prev => prev.filter(file => file.id !== id));
      if (selectedAudio?.id === id) setSelectedAudio(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete audio file');
    }
  };

  const handleShareAudio = (file) => {
    navigator.clipboard.writeText(file.audio_url);
    alert('Audio URL copied to clipboard!');
  };

  return (
    <div className={`flex h-screen bg-background-light dark:bg-background-dark`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        audioFiles={audioFiles}
        onSelectedAudio={setSelectedAudio}
        selectedAudio={selectedAudio}
        onDeleteAudio={handleDeleteAudio}
        onShareAudio={handleShareAudio}
        onNewChat={() => {
          handleNewChat();
        }}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader
         toggleSidebar={toggleSidebar}
        />

        <MainWorkspace
         onNewConversion={handleNewConversion}
         selectedAudio={selectedAudio}
         onSelectedAudio={(audio) => {
          setSelectedAudio(audio);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
         onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}

export default App;
