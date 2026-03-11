import React from 'react';
import { UserProfile } from '../types';
import { BADGES } from '../constants';
import { Edit3, Settings, Shield, Bell, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onEdit: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onEdit }) => {
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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Profile Header */}
      <motion.div variants={item} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-indigo-50 dark:ring-indigo-900/30"
            />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-xl shadow-lg"
            >
              <Edit3 size={16} />
            </motion.button>
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">@{user.username}</p>
            </div>
            <div className="relative group/bio inline-block">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg pr-8">
                {user.bio || "Passionate learner exploring the frontiers of AI and systematic knowledge extraction."}
              </p>
              <button 
                onClick={onEdit}
                className="absolute right-0 top-0 p-1 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover/bio:opacity-100 transition-opacity hover:scale-110"
                title="Edit Bio"
              >
                <Edit3 size={14} />
              </button>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold">Level {user.level}</div>
              <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-bold">{user.streak} Day Streak</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const earned = user.badges.includes(badge.id);
            return (
              <motion.div 
                key={badge.id} 
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-6 rounded-3xl border text-center space-y-3 transition-all ${
                  earned 
                    ? 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-900/50 shadow-sm' 
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700 grayscale opacity-40'
                }`}
              >
                <div className="text-4xl">{badge.icon}</div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{badge.name}</h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  {earned ? 'EARNED' : 'LOCKED'}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Settings Options */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h3>
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700/50">
          <motion.button whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }} className="w-full flex items-center justify-between p-6 transition-colors">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Bell size={20} /></div>
              <span className="font-semibold">Notifications</span>
            </div>
            <ChevronRight className="text-gray-300 dark:text-gray-600" />
          </motion.button>
          <motion.button whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }} className="w-full flex items-center justify-between p-6 transition-colors">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><Shield size={20} /></div>
              <span className="font-semibold">Privacy & Security</span>
            </div>
            <ChevronRight className="text-gray-300 dark:text-gray-600" />
          </motion.button>
          <motion.button whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }} className="w-full flex items-center justify-between p-6 transition-colors">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl"><Settings size={20} /></div>
              <span className="font-semibold">App Preferences</span>
            </div>
            <ChevronRight className="text-gray-300 dark:text-gray-600" />
          </motion.button>
          <motion.button 
            whileHover={{ backgroundColor: "rgba(254, 242, 242, 1)" }}
            onClick={onLogout}
            className="w-full flex items-center justify-between p-6 transition-colors text-red-600"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl"><LogOut size={20} /></div>
              <span className="font-semibold">Log Out</span>
            </div>
            <ChevronRight className="text-red-400" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
