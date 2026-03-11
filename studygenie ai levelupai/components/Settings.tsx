import React from 'react';
import { AppState, Difficulty } from '../types';
import { Moon, Sun, Bell, Shield, Trash2, Info, ChevronRight, Lock, Mail, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  state: AppState;
  onUpdateState: (newState: Partial<AppState>) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onUpdateState }) => {
  const toggleDarkMode = () => {
    onUpdateState({ isDarkMode: !state.isDarkMode });
  };

  const toggleNotifications = () => {
    onUpdateState({ notificationsEnabled: !state.notificationsEnabled });
  };

  const sections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'dark_mode',
          label: 'Dark Mode',
          description: 'Adjust the theme of the application',
          icon: state.isDarkMode ? Moon : Sun,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          action: (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                state.isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                  state.isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </motion.button>
          ),
        },
        {
          id: 'notifications',
          label: 'Notifications',
          description: 'Daily study reminders and goal alerts',
          icon: Bell,
          color: 'text-orange-500',
          bg: 'bg-orange-50',
          action: (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                state.notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                  state.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </motion.button>
          ),
        },
        {
          id: 'difficulty',
          label: 'Default Difficulty',
          description: 'Set your preferred starting quiz level',
          icon: Shield,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          action: (
            <select className="bg-transparent text-xs font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer">
              <option value="EASY">EASY</option>
              <option value="MEDIUM" selected>MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          ),
        },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        { label: 'Change Password', icon: Lock, color: 'text-gray-400', action: <ChevronRight size={18} /> },
        { label: 'Update Email', icon: Mail, color: 'text-gray-400', action: <ChevronRight size={18} /> },
        { label: 'Delete Account', icon: UserX, color: 'text-red-500', action: <ChevronRight size={18} /> },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        { 
          label: 'Clear History', 
          icon: Trash2, 
          color: 'text-red-500', 
          action: <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline" onClick={() => {if(confirm('Are you sure you want to clear all data?')) { window.localStorage.clear(); window.location.reload(); }}}>Clear</button> 
        },
        { 
          label: 'AI Transparency', 
          icon: Info, 
          color: 'text-gray-400', 
          action: <span className="text-[10px] font-bold text-gray-400">v1.2.4</span> 
        },
      ],
    },
  ];

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
      className="max-w-xl mx-auto space-y-8 pb-20"
    >
      <motion.div variants={item}>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Customize your study experience.</p>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section) => (
          <motion.div variants={item} key={section.title} className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
              {section.title}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              {section.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                  className={`flex items-center justify-between p-6 transition-colors ${
                    idx !== section.items.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${item.bg || 'bg-gray-50 dark:bg-gray-700/50'} ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.label}</h4>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div>{item.action}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50">
        <div className="flex gap-4">
          <Info className="text-indigo-600 shrink-0" size={24} />
          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
            Your data is stored locally for maximum privacy. Clearing your history will permanently delete all uploaded materials and quiz results.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
