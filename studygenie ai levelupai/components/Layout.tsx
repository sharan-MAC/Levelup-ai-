
import React from 'react';
import { Home, BookOpen, BarChart2, User, Settings, Zap, Trophy, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'learning', icon: BookOpen, label: 'Study' },
    { id: 'challenges', icon: Trophy, label: 'Challenges' },
    { id: 'tutor', icon: MessageSquare, label: 'Tutor' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 p-6 z-30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">S</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">StudyGenie</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                activeTab === tab.id 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeSidebar"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10"><tab.icon size={20} /></span>
              <span className="text-sm relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto">
           <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
              activeTab === 'settings' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
           >
            {activeTab === 'settings' && (
                <motion.div
                  layoutId="activeSidebar"
                  className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className="relative z-10"><Settings size={20} /></span>
            <span className="text-sm relative z-10">Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex justify-between items-center z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 flex-1 relative ${
              activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeMobile"
                className="absolute -top-3 w-8 h-1 bg-indigo-600 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <motion.div
              animate={{ scale: activeTab === tab.id ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <tab.icon size={22} />
            </motion.div>
            <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto px-4 pt-6 md:pt-10 pb-20 md:pb-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
