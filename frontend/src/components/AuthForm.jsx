// client/src/components/AuthPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiArrowRight, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp, signIn, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'login') {
        const { error: signInError } = await signIn({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { full_name: name },
            emailRedirectTo: 'http://localhost:3000/confirm-success'
          }
        });
        if (error) throw error;
        navigate('/confirmation-prompt');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative"
      >
        {/* <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
            >
              <FiMail className="w-16 h-16 text-indigo-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Confirm Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a confirmation link to <strong>{email}</strong>.
                <br />
                Please check your inbox and verify your email to continue.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Go to Login
                </button>
              </div>
  </motion.div>
          )}
        </AnimatePresence> */}

        <div className={`${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <FiArrowRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {type === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {type === 'login' 
                ? 'Sign in to continue' 
                : 'Get started with your free account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'signup' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <FiUser className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <FiMail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <FiLock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-red-500 text-sm flex items-center gap-2"
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin w-5 h-5" />
                  Processing...
                </>
              ) : type === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </motion.button>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
              {type === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;