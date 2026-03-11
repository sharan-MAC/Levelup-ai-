import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LearningMaterial } from '../types';
import { Send, Sparkles, Brain, Book, Zap, Trash2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface AITutorProps {
  materials: LearningMaterial[];
  chatHistory: ChatMessage[];
  onUpdateChat: (chat: ChatMessage[]) => void;
}

const AITutor: React.FC<AITutorProps> = ({ materials, chatHistory, onUpdateChat }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: new Date().toISOString() };
    const updatedChat = [...chatHistory, userMsg];
    onUpdateChat(updatedChat);
    setInput('');
    setIsTyping(true);

    try {
      // Aggregate context from all materials
      const context = materials.length > 0 
        ? materials.map(m => `Title: ${m.title}\nContent: ${m.content}`).join('\n\n---\n\n')
        : "No specific materials uploaded. Answer based on general knowledge.";
      
      const responseText = await geminiService.chat(text, context, chatHistory);
      
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: responseText,
        timestamp: new Date().toISOString() 
      };
      onUpdateChat([...updatedChat, aiMsg]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toISOString() 
      };
      onUpdateChat([...updatedChat, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    onUpdateChat([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-200px)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            AI Tutor <Sparkles className="text-indigo-600" size={18} />
          </h2>
          <p className="text-xs text-gray-400 font-medium">Context: {materials.length > 0 ? `${materials.length} Materials Loaded` : 'General Knowledge'}</p>
        </div>
        <button onClick={clearChat} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 scrollbar-hide mb-4 px-1">
        <AnimatePresence initial={false}>
          {chatHistory.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-20 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto"><Brain size={32} /></div>
              <h3 className="text-lg font-black text-gray-900">What shall we explore today?</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">Ask me about your uploaded materials or test your knowledge.</p>
            </motion.div>
          )}
          
          {chatHistory.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start"
            >
               <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex gap-1">
                 <motion.div 
                   animate={{ y: [0, -5, 0] }} 
                   transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                   className="w-1.5 h-1.5 bg-gray-300 rounded-full" 
                 />
                 <motion.div 
                   animate={{ y: [0, -5, 0] }} 
                   transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                   className="w-1.5 h-1.5 bg-gray-300 rounded-full" 
                 />
                 <motion.div 
                   animate={{ y: [0, -5, 0] }} 
                   transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                   className="w-1.5 h-1.5 bg-gray-300 rounded-full" 
                 />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSend("Explain simply")} className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 shrink-0 hover:border-indigo-600 transition-colors flex items-center gap-1"><Book size={12}/> Explain Simply</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSend("Real-life example")} className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 shrink-0 hover:border-indigo-600 transition-colors flex items-center gap-1"><Zap size={12}/> Real Example</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSend("Test me")} className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 shrink-0 hover:border-indigo-600 transition-colors flex items-center gap-1"><Brain size={12}/> Test Me</motion.button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..." 
            className="w-full pl-6 pr-14 py-5 bg-white dark:bg-gray-800 rounded-[2rem] border-none shadow-xl shadow-indigo-100/30 dark:shadow-none text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Send size={18} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AITutor;
