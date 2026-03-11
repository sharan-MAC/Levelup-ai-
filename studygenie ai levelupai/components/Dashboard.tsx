
import React from 'react';
import { AppState } from '../types';
import { XP_PER_LEVEL } from '../constants';
import { TrendingUp, Flame, Book, Zap, Plus, AlertCircle, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  state: AppState;
  onAddMaterial: () => void;
  onStartQuiz: () => void;
  onStartTutor: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Dashboard: React.FC<DashboardProps> = ({ state, onAddMaterial, onStartQuiz, onStartTutor }) => {
  const { user, materials } = state;
  if (!user) return null;

  const xpProgress = (user.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  return (
    <motion.div 
      className="space-y-8 pb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Profile Section */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={user.avatarUrl} 
            className="w-12 h-12 rounded-2xl object-cover ring-4 ring-indigo-50" 
            alt="Profile" 
          />
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Hey, {user.name.split(' ')[0]} 👋</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Level {user.level}</span>
              <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-600" 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"
        >
          <Plus size={24} onClick={onAddMaterial} />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-lg"><Flame size={18} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Streak</span>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{user.streak} Days</p>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg"><TrendingUp size={18} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Daily XP</span>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">+120</p>
        </motion.div>
      </motion.div>

      {/* Alerts */}
      {(() => {
        const allConcepts = materials.flatMap(m => m.concepts);
        const weakConcept = allConcepts.find(c => c.mastery < 3);
        
        if (weakConcept) {
          return (
            <motion.div 
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="bg-red-50 dark:bg-red-900/20 p-5 rounded-[2rem] border border-red-100 dark:border-red-800/50 flex items-start gap-4"
            >
              <AlertCircle className="text-red-500 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-300 text-sm">Weak Concept Alert!</h4>
                <p className="text-xs text-red-700 dark:text-red-400/80 mt-1">"{weakConcept.name}" is at {weakConcept.mastery * 20}% mastery. Take a quick quiz to level it up.</p>
              </div>
            </motion.div>
          );
        }
        return null;
      })()}

      {/* Quick Actions */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddMaterial} 
            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:bg-indigo-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Book size={24} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Upload PDF</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartQuiz} 
            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:bg-yellow-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Start Quiz</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartTutor} 
            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:bg-emerald-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">AI Tutor</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartQuiz} 
            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:bg-blue-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Revision</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
