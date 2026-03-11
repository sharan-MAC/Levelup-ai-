import React from 'react';
import { Trophy, Zap, Target, Swords, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChallengesProps {
  onStartChallenge: (id: string) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ onStartChallenge }) => {
  const challengeGroups = [
    {
      title: 'Daily Goals',
      items: [
        { id: 'daily_1', title: 'Concept Sprint', description: 'Master 3 concepts in under 10 minutes.', reward: '150 XP', difficulty: 'EASY', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
        { id: 'daily_2', title: 'Perfect Accuracy', description: 'Score 100% on a medium quiz.', reward: '250 XP', difficulty: 'MEDIUM', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
      ]
    },
    {
      title: 'Level Up Battles',
      items: [
        { id: 'boss_1', title: 'Boss Battle: AI Ethics', description: 'A rigorous 15-question quiz covering all weak spots.', reward: '1000 XP', difficulty: 'BOSS', icon: Swords, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30' },
        { id: 'streak_1', title: 'Weak Spot Cleanup', description: 'Address all 5 current weak concepts.', reward: '500 XP', difficulty: 'HARD', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
      ]
    }
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
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Challenges</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Earn massive XP and unlock rare badges.</p>
      </motion.div>

      {challengeGroups.map((group) => (
        <motion.div variants={item} key={group.title} className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{group.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.items.map((challenge) => (
              <motion.button 
                key={challenge.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartChallenge(challenge.id)}
                className={`relative overflow-hidden flex flex-col items-start p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 text-left hover:shadow-lg transition-all group`}
              >
                <motion.div 
                  className={`p-4 ${challenge.bg} ${challenge.color} rounded-2xl mb-4 transition-transform`}
                >
                  <challenge.icon size={32} />
                </motion.div>
                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 dark:text-white">{challenge.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-8">{challenge.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{challenge.reward}</span>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    challenge.difficulty === 'BOSS' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400'
                  }`}>
                    {challenge.difficulty}
                  </div>
                </div>
                <ChevronRight className="absolute top-6 right-6 text-gray-200 dark:text-gray-700" size={24} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl"
      >
        <div>
          <h4 className="text-xl font-black">Tournament Begins in 2h</h4>
          <p className="text-indigo-200 text-sm">Compete with friends for the Knowledge Cup.</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        >
          <Trophy size={48} className="text-white opacity-20" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Challenges;
