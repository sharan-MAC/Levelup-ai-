
import React, { useState, useEffect } from 'react';
import { QuizQuestion, Difficulty, UserProfile } from '../types';
import { Zap, CheckCircle2, XCircle, ArrowRight, Trophy, Loader2, Sword } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { DIFFICULTY_MULTIPLIERS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizProps {
  materialId: string;
  materialContent: string;
  user: UserProfile;
  onComplete: (score: number, xpGained: number) => void;
  isChallenge?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ materialId, materialContent, user, onComplete, isChallenge }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        let difficulty = Difficulty.MEDIUM;
        let multiplier = 1;

        if (materialId.includes('boss')) {
          difficulty = Difficulty.BOSS;
          multiplier = 2.0;
        } else if (materialId.includes('daily_1')) {
          difficulty = Difficulty.EASY;
          multiplier = 1.0;
        } else if (materialId.includes('streak')) {
          difficulty = Difficulty.HARD;
          multiplier = 1.5;
        }

        setDifficultyMultiplier(multiplier);

        const q = await geminiService.generateQuiz(materialContent, difficulty);
        setQuestions(q);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [materialContent, materialId]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const totalXp = Math.round(score * 50 * difficultyMultiplier);
      setXpGained(totalXp);
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
          <Loader2 className="animate-spin text-indigo-600 relative z-10" size={64} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-gray-900 animate-pulse">Forging Challenge...</h3>
          <p className="text-gray-500 text-sm">Analyzing content complexity</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 py-10"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="text-yellow-500" size={64} />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
          >
            +{xpGained} XP
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900">Quest Complete!</h2>
          <p className="text-gray-500 font-medium">You scored {score} out of {questions.length}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Accuracy</div>
            <div className="text-xl font-black text-gray-900">{Math.round((score / questions.length) * 100)}%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Multiplier</div>
            <div className="text-xl font-black text-indigo-600">{difficultyMultiplier}x</div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(score, xpGained)}
          className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
        >
          Claim Rewards
        </motion.button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            {isChallenge && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                <Sword size={10} /> Challenge
              </span>
            )}
          </div>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {currentQ.question}
          </h3>

          <div className="space-y-4">
            {currentQ.options.map((option, idx) => {
              let bgColor = "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-600";
              if (isAnswered) {
                if (idx === currentQ.correctAnswer) bgColor = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400";
                else if (idx === selectedOption) bgColor = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400";
                else bgColor = "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-50";
              } else if (selectedOption === idx) {
                bgColor = "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-600 text-indigo-700 dark:text-indigo-400";
              }

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium flex items-center justify-between ${bgColor}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 size={20} />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle size={20} />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed border border-indigo-100 dark:border-indigo-800 mb-6">
                  <span className="font-bold block mb-1">Explanation</span>
                  {currentQ.explanation}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextQuestion}
                  className="w-full py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
