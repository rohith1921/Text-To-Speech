// client/src/components/AudioList.jsx
import AudioPlayer from './AudioPlayer';
import { AudioListSkeleton } from './SkeletonLoader';

const AudioList = ({ audioFiles, loading }) => {
  if (loading) {
    return <AudioListSkeleton />;
  }

  if (audioFiles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No audio files available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Previous Conversions</h2>
      <div className="space-y-4 h-[500px] overflow-y-auto 
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 
        pr-2 pb-4">
        {audioFiles.map((file) => (
          <div key={file.id} className="border-b pb-4">
            <p className="text-gray-600 mb-2">{file.text}</p>
            <AudioPlayer audioUrl={file.audio_url} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioList;