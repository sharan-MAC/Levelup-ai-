import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Github, Mail, Lock, User, AtSign, ArrowRight, Camera, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
  onAuthComplete: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete }) => {
  const [view, setView] = useState<'splash' | 'login' | 'signup'>('splash');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => {}, 2000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: 'user_123',
        name: 'Alex Rivers',
        username: 'alexrivers',
        email: 'alex@example.com',
        bio: 'Knowledge architect and lifelong student of the world.',
        avatarUrl: 'https://picsum.photos/200',
        xp: 450,
        level: 1,
        streak: 3,
        badges: ['newbie'],
        lastLogin: new Date().toISOString()
      };
      onAuthComplete(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  if (view === 'splash') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-100 dark:shadow-none"
          >
            S
          </motion.div>
          <div className="space-y-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter"
            >
              StudyGenie
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs"
            >
              Level Up Your Learning
            </motion.p>
          </div>
        </div>
        <div className="mt-24 w-full max-w-xs space-y-4">
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('login')}
            className="w-full py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-colors"
          >
            Log In
          </motion.button>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('signup')}
            className="w-full py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center p-6">
      <motion.div 
        key={view}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="flex items-center gap-2">
           <motion.button whileHover={{ x: -5 }} onClick={() => setView('splash')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeft size={24} />
           </motion.button>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Your AI knowledge accelerator awaits.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 dark:shadow-none border border-gray-100 dark:border-gray-700">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence>
            {view === 'signup' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="flex justify-center mb-6">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-24 h-24 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors group">
                    <Camera size={24} className="group-hover:text-indigo-500" />
                    <span className="text-[10px] font-bold mt-1 uppercase">DP</span>
                  </motion.div>
                </div>
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input type="text" placeholder="Full Name" className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white" />
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <AtSign size={18} />
              </div>
              <input type="text" placeholder="Username or email" className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white" required />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input type="password" placeholder="Password" className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white" required />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <>{view === 'login' ? 'Log In' : 'Create Account'} <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700"></div>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700"></div>
          </div>

          <div className="mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
              <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Google Login</span>
            </motion.button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              {view === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
