import { Link } from 'react-router-dom';

export default function ConfirmationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Email Confirmed! 🎉</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your email has been successfully verified. You can now login to access your account.
        </p>
        <Link
          to="/login"
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};
