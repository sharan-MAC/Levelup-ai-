
import React from 'react';
import { UserStats, UserProfile, LearningMaterial } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Target, Zap, Clock, TrendingUp, Award, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressProps {
  stats: UserStats;
  materials: LearningMaterial[];
  user: UserProfile;
}

const Progress: React.FC<ProgressProps> = ({ stats, materials, user }) => {
  const data = [
    { name: 'Mon', accuracy: 65, retention: 40 },
    { name: 'Tue', accuracy: 70, retention: 45 },
    { name: 'Wed', accuracy: 75, retention: 60 },
    { name: 'Thu', accuracy: 72, retention: 55 },
    { name: 'Fri', accuracy: 85, retention: 70 },
    { name: 'Sat', accuracy: 90, retention: 80 },
    { name: 'Sun', accuracy: 88, retention: 75 },
  ];

  const masteryData = [
    { name: 'Weak', value: 15, color: '#ef4444' },
    { name: 'Learning', value: 45, color: '#f59e0b' },
    { name: 'Strong', value: 30, color: '#10b981' },
    { name: 'Mastered', value: 10, color: '#6366f1' },
  ];

  const skills = [
    { label: 'Speed', val: 78, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Accuracy', val: 92, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Retention', val: 64, icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Consistency', val: 85, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
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
      className="space-y-8 pb-12"
    >
      <motion.div variants={item}>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Growth Map</h2>
        <p className="text-gray-500 dark:text-gray-400">Visualization of your neural progress.</p>
      </motion.div>

      {/* High Level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <motion.div 
            key={skill.label} 
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center shadow-sm"
          >
            <div className={`p-3 rounded-2xl mb-3 ${skill.bg} ${skill.color}`}><skill.icon size={24} /></div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{skill.val}%</p>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{skill.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-[0.2em]">Learning Curve</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-600" /><span className="text-[10px] font-bold text-gray-400 uppercase">Acc.</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400" /><span className="text-[10px] font-bold text-gray-400 uppercase">Ret.</span></div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" animationDuration={1500} />
                <Area type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRet)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-[0.2em] mb-6">Mastery Mix</h3>
          <div className="h-48 flex-1">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={masteryData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" animationDuration={1500}>
                  {masteryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {masteryData.map(m => (
               <div key={m.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                 <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{m.name}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* XP Timeline */}
      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-gray-900 dark:bg-indigo-950 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Level {user.level} Scholar</h3>
            <p className="text-gray-400 text-sm">You are in the top 5% of learners this month.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-indigo-600 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-xl"
          >
            <Award size={20} /> View Leaderboard
          </motion.button>
        </div>
        <TrendingUp className="absolute -bottom-8 -right-8 w-64 h-64 text-white opacity-5 rotate-12" />
      </motion.div>
    </motion.div>
  );
};

export default Progress;
