// client/src/components/Sidebar.jsx
import { FiSearch, FiPlus, FiChevronLeft, FiX, FiMoreHorizontal } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import { truncateText } from '../utils/helpers';

const groupFilesByDate = (files) => {
    const grouped = { today: [], yesterday: [], older: [] };
    const now = new Date();
    
    files.forEach(file => {
      const fileDate = new Date(file.created_at);
      const diffDays = Math.floor((now - fileDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        grouped.today.push(file);
      } else if (diffDays === 1) {
        grouped.yesterday.push(file);
      } else {
        grouped.older.push(file);
      }
    });
  
    return grouped;
};

const Historyitem = ({ file, isSelected, onSelect, onDelete, onShare }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='group relative'>
            <div
                onClick={onSelect}
                className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer ${isSelected ? 'bg-indigo-100 dark:bg-gray-700' : ''}`}
            >
                <div className='flex justify-between items-center'>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-text-primary-light dark:text-text-primary-dark truncate"
                        >
                            {truncateText(file.text)}
                        </p>
                    </div>

                    <div className='ml-2'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                        <FiMoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>

                {showMenu && (
                    <div ref={menuRef} className="absolute right-0 top-8 z-10 bg-surface-light dark:bg-gray-800 shadow-lg rounded-md p-2 w-32">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(file);
                                setShowMenu(false);
                            }}
                            className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                            Share
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(file.id);
                                setShowMenu(false);
                            }}
                            className="w-full p-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-red-900/20 rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, toggleSidebar, audioFiles, onSelectedAudio, selectedAudio, onNewChat, onDeleteAudio, onShareAudio }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [fileToDelete, setFileToDelete] = useState(null);
    const { darkMode } = useTheme();

    const filteredFiles = audioFiles.filter(file =>
        file.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedFiles = groupFilesByDate(filteredFiles);

    return (
        <>
            <div className={`fixed inset-y-0 left-0 h-full bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 shadow-lg transform transition-all duration-300 ${isOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0 md:w-12'
                } md:relative md:left-auto z-20 overflow-hidden`}
            >
                {/* Header Section */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 h-[60px]">
                    <div className='flex items-center justify-between h-full'>
                        {isOpen ? (
                            <>
                                <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">History</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={toggleSidebar}
                                        className={`hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg`}
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={toggleSidebar}
                                        className={`md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg`}
                                    >
                                        <FiX className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex justify-center">
                                <button
                                    onClick={toggleSidebar}
                                    className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <FiChevronLeft className="w-5 h-5 transform rotate-180" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={onNewChat}
                                className="w-full flex items-center gap-2 p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                            >
                                <FiPlus className="w-5 h-5" />
                                New Chat
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-text-primary-light dark:text-text-primary-dark"
                                />
                                <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </div>

                            <div className="h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                                <div className="space-y-6">
                                    {groupedFiles.today.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today</h3>
                                    {groupedFiles.today.map((file) => (
                                        <Historyitem
                                            key={file.id}
                                            file={file}
                                            isSelected={selectedAudio?.id === file.id}
                                            onSelect={() => {
                                                onSelectedAudio(prev =>
                                                    prev?.id === file.id ? null : file
                                                )
                                                if (window.innerWidth < 768) toggleSidebar()
                                            }}
                                            onDelete={(fileId) => setFileToDelete(fileId)}
                                            onShare={onShareAudio}
                                        />
                                    ))}
                                </div>
                                )}

                                {groupedFiles.yesterday.length > 0 && (
                                    <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Yesterday</h3>
                                            {groupedFiles.yesterday.map((file) => {
                                            <Historyitem
                                            key={file.id}
                                            file={file}
                                            isSelected={selectedAudio?.id === file.id}
                                            onSelect={() => {
                                                onSelectedAudio(prev =>
                                                    prev?.id === file.id ? null : file
                                                )
                                                if (window.innerWidth < 768) toggleSidebar()
                                            }}
                                            onDelete={(fileId) => setFileToDelete(fileId)}
                                            onShare={onShareAudio}
                                            />
                                        })}
                                </div>
                            )}

                            {groupedFiles.older.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Older</h3>
                                    {groupedFiles.older.map((file) => (
                                        <Historyitem
                                            key={file.id}
                                            file={file}
                                            isSelected={selectedAudio?.id === file.id}
                                            onSelect={() => {
                                                onSelectedAudio(prev =>
                                                    prev?.id === file.id ? null : file
                                                )
                                                if (window.innerWidth < 768) toggleSidebar()
                                            }}
                                            onDelete={(fileId) => setFileToDelete(fileId)}
                                            onShare={onShareAudio}
                                        />
                                    ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
                )}
            </div>

            {fileToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                            Confirm Delete?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this audio file?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setFileToDelete(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteAudio(fileToDelete);
                                    setFileToDelete(null);
                                }}
                                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;