// client/src/components/TopHeader.jsx
import { useState } from 'react';
import { FiMenu, FiUser, FiSun, FiMoon, FiSettings, FiLogOut } from 'react-icons/fi';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ProfileDropdown = () => {
    const { user, signOut } = useAuth();
    const { darkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                    <FiUser className='text-indigo-600 dark:text-indigo-400' />
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                            {user?.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => {
                                setShowProfileModal(true);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <FiUser className="text-gray-600 dark:text-gray-300" />
                            <span>Profile</span>
                        </button>

                        <button
                            onClick={async () => {
                                await signOut();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500"
                        >
                            <FiLogOut className="text-red-500" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
                                <p className="font-medium">{user?.user_metadata?.full_name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="mt-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const TopHeader = ({ toggleSidebar, isSidebarOpen }) => {
    const { darkMode, toggleDarkMode } = useTheme();
    return (
        <header className="bg-surface-light dark:bg-surface-dark shadow-sm p-4 flex items-center justify-between transition-colors duration-300">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="flex items-center space-x-2">
                    <Logo darkMode={darkMode} />
                    <span className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        Text To Speech
                    </span>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    {darkMode ? (
                        <FiSun className="w-5 h-5 text-text-primary-light dark:text-text-primary-dark" />
                    ) : (
                        <FiMoon className="w-5 h-5 text-text-primary-light dark:text-text-primary-dark" />
                    )}
                </button>
                <ProfileDropdown />
            </div>
        </header>
    );
};

export default TopHeader;