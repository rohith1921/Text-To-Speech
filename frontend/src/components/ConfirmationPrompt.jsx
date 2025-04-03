import { Link } from "react-router-dom";

export default function ConfirmationPrompt() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Check Your Inbox</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We've sent a confirmation link to your email. Please click it to verify your account.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    Already confirmed? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}