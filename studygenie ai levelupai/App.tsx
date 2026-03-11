
import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, LearningMaterial, Difficulty } from './types';
import { storageService } from './services/storageService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import LearningHub from './components/LearningHub';
import Profile from './components/Profile';
import Quiz from './components/Quiz';
import Challenges from './components/Challenges';
import Progress from './components/Progress';
import AITutor from './components/AITutor';
import Settings from './components/Settings';
import EditProfile from './components/EditProfile';
import { XP_PER_LEVEL } from './constants';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = storageService.getState();
    return {
      ...saved,
      chatHistory: saved.chatHistory || []
    };
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentQuizMaterialId, setCurrentQuizMaterialId] = useState<string | null>(null);

  useEffect(() => {
    storageService.saveState(state);
    if (state.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state]);

  const handleAuth = (user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  };

  const handleLogout = () => {
    setState({ user: null, materials: [], stats: state.stats, isDarkMode: false, chatHistory: [] });
    storageService.clear();
  };

  const handleAddMaterial = (material: LearningMaterial) => {
    setState(prev => ({
      ...prev,
      materials: [material, ...prev.materials],
      user: prev.user ? { ...prev.user, xp: prev.user.xp + 100 } : null
    }));
    setActiveTab('dashboard');
  };

  const handleQuizComplete = (score: number, xpGained: number) => {
    setState(prev => {
      if (!prev.user) return prev;
      const newXp = prev.user.xp + xpGained;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      
      return {
        ...prev,
        user: { 
          ...prev.user, 
          xp: newXp, 
          level: newLevel,
          badges: newLevel > prev.user.level ? [...prev.user.badges, 'scholar'] : prev.user.badges
        },
        stats: {
          ...prev.stats,
          totalQuizzes: prev.stats.totalQuizzes + 1,
          accuracy: ((prev.stats.accuracy * prev.stats.totalQuizzes) + (score/5*100)) / (prev.stats.totalQuizzes + 1)
        }
      };
    });
    setCurrentQuizMaterialId(null);
    setActiveTab('dashboard');
  };

  if (!state.user) {
    return <Auth onAuthComplete={handleAuth} />;
  }

  const renderContent = () => {
    if (currentQuizMaterialId) {
      // Check if it's a challenge
      if (currentQuizMaterialId.startsWith('challenge_') || currentQuizMaterialId.startsWith('daily_') || currentQuizMaterialId.startsWith('boss_') || currentQuizMaterialId.startsWith('streak_')) {
        const aggregatedContent = state.materials.map(m => m.content).join('\n\n');
        return (
          <Quiz 
            materialId={currentQuizMaterialId} 
            materialContent={aggregatedContent || "General Knowledge Quiz"} 
            user={state.user!} 
            onComplete={handleQuizComplete} 
            isChallenge={true}
          />
        );
      }

      const mat = state.materials.find(m => m.id === currentQuizMaterialId);
      return mat ? (
        <Quiz 
          materialId={mat.id} 
          materialContent={mat.content} 
          user={state.user!} 
          onComplete={handleQuizComplete} 
        />
      ) : null;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            state={state} 
            onAddMaterial={() => setActiveTab('learning')} 
            onStartQuiz={() => {
              if (state.materials.length > 0) {
                const randomMaterial = state.materials[Math.floor(Math.random() * state.materials.length)];
                setCurrentQuizMaterialId(randomMaterial.id);
              }
            }}
            onStartTutor={() => setActiveTab('tutor')}
          />
        );
      case 'learning':
        return <LearningHub onMaterialProcessed={handleAddMaterial} materials={state.materials} />;
      case 'tutor':
        return <AITutor materials={state.materials} chatHistory={state.chatHistory} onUpdateChat={(chat) => setState(prev => ({ ...prev, chatHistory: chat }))} />;
      case 'stats':
        return <Progress stats={state.stats} materials={state.materials} user={state.user!} />;
      case 'challenges':
        return <Challenges onStartChallenge={(id) => setCurrentQuizMaterialId(id)} />;
      case 'profile':
        return <Profile user={state.user!} onLogout={handleLogout} onEdit={() => setActiveTab('edit_profile')} />;
      case 'settings':
        return <Settings state={state} onUpdateState={(s) => setState(prev => ({ ...prev, ...s }))} />;
      case 'edit_profile':
        return <EditProfile user={state.user!} onSave={(u) => { setState(prev => ({ ...prev, user: u })); setActiveTab('profile'); }} onBack={() => setActiveTab('profile')} />;
      default:
        return <Dashboard state={state} onAddMaterial={() => setActiveTab('learning')} onStartQuiz={() => {}} onStartTutor={() => setActiveTab('tutor')} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Layout activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setCurrentQuizMaterialId(null);
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (currentQuizMaterialId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </div>
  );
};

export default App;
