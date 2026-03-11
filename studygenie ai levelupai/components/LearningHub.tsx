
import React, { useState } from 'react';
import { Upload, FileText, Video, Loader2, Share2, BrainCircuit, Zap, Youtube, ChevronRight, Map } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { LearningMaterial, Concept } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LearningHubProps {
  onMaterialProcessed: (material: LearningMaterial) => void;
  materials: LearningMaterial[];
}

const LearningHub: React.FC<LearningHubProps> = ({ onMaterialProcessed, materials }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [activeView, setActiveView] = useState<'upload' | 'study'>('upload');
  const [studyTab, setStudyTab] = useState<'notes' | 'concepts' | 'map'>('notes');
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(materials[0] || null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'video' | 'text' | 'youtube') => {
    // ... (existing logic)
    const file = e.target.files?.[0];
    if (!file && type !== 'youtube') return;

    setIsProcessing(true);
    setStatus('Reading file...');

    try {
      let content = '';
      
      if (type === 'pdf') {
        // Read PDF as Base64
        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file!);
        });
      } else if (type === 'text') {
        // Read text file
        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file!);
        });
      } else if (type === 'video') {
         if (file!.size > 20 * 1024 * 1024) {
            alert("Video too large for inline processing. Please use a smaller video or a YouTube link.");
            setIsProcessing(false);
            return;
         }
         const reader = new FileReader();
         content = await new Promise((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file!);
         });
      } else {
        content = "YouTube video content placeholder. Please provide text content for better analysis.";
      }

      setStatus('AI Analysis...');
      
      // Call Gemini Service
      const { summary, concepts, extractedText } = await geminiService.extractConcepts({ 
        type: type === 'youtube' ? 'text' : type as any, 
        content 
      });
      
      const newMaterial: LearningMaterial = {
        id: Math.random().toString(36).substr(2, 9),
        title: file?.name.replace(/\.[^/.]+$/, "") || "New Resource",
        type,
        content: extractedText || content, 
        summary,
        concepts: concepts.map(c => ({ ...c, status: 'LEARNING' })),
        createdAt: new Date().toISOString()
      };

      onMaterialProcessed(newMaterial);
      setSelectedMaterial(newMaterial);
      setActiveView('study');
    } catch (err) {
      console.error(err);
      setStatus('Error processing file. Please try again.');
      setTimeout(() => setIsProcessing(false), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (activeView === 'study' && selectedMaterial) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <button onClick={() => setActiveView('upload')} className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 hover:text-indigo-600 transition-colors">
            <ChevronRight className="rotate-180" size={14} /> Back
          </button>
          <h2 className="text-sm font-black text-gray-900 truncate max-w-[150px]">{selectedMaterial.title}</h2>
          <button className="p-2 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"><Share2 size={16} /></button>
        </div>

        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          {(['notes', 'concepts', 'map'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStudyTab(tab)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all relative ${
                studyTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
              }`}
            >
              {studyTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {studyTab === 'notes' && (
              <motion.div 
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
              >
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">AI Summary</h3>
                <div className="prose prose-indigo dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{selectedMaterial.summary}</p>
                </div>
              </motion.div>
            )}

            {studyTab === 'concepts' && (
              <motion.div 
                key="concepts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {selectedMaterial.concepts.map((concept, index) => (
                  <motion.div 
                    key={concept.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${
                      concept.status === 'WEAK' ? 'bg-red-500' : concept.status === 'LEARNING' ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white">{concept.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{concept.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {studyTab === 'map' && (
              <motion.div 
                key="map"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-indigo-950 rounded-[2.5rem] p-8 aspect-square relative overflow-hidden flex items-center justify-center text-center"
              >
                <div className="relative z-10">
                  <Map className="text-indigo-400 mx-auto mb-4" size={64} />
                  <h3 className="text-xl font-black text-white">Interactive Knowledge Map</h3>
                  <p className="text-indigo-300/60 text-sm mt-2">Visualizing {selectedMaterial.concepts.length} concept nodes...</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl"
                  >
                    Launch Graph
                  </motion.button>
                </div>
                {/* ... (background elements) */}
                 <div className="absolute inset-0 opacity-20">
                     <div className="absolute top-10 left-10 w-4 h-4 bg-red-400 rounded-full blur-sm" />
                     <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-yellow-400 rounded-full blur-sm" />
                     <div className="absolute bottom-10 right-10 w-8 h-8 bg-emerald-400 rounded-full blur-sm" />
                     <svg className="absolute inset-0 w-full h-full stroke-indigo-800/50 stroke-[0.5]" viewBox="0 0 100 100">
                        <line x1="10" y1="10" x2="25" y2="50" />
                        <line x1="25" y1="50" x2="90" y2="90" />
                     </svg>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Level Up Learning</h2>
        <p className="text-gray-500 font-medium">Your knowledge vault. Upload and expand.</p>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center space-y-6 text-center"
          >
            <div className="relative">
              <Loader2 className="animate-spin text-indigo-600" size={64} />
              <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{status}</h3>
              <p className="text-gray-500 text-sm">Our AI is mapping neural connections...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.label 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(238, 242, 255, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-gray-100 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'pdf')} />
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">PDF</h3>
              </motion.label>

              <motion.label 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(238, 242, 255, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-gray-100 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Video size={28} />
                </div>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Video</h3>
              </motion.label>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(238, 242, 255, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-gray-100 flex items-center gap-4 hover:border-indigo-400 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <Youtube size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-gray-900 text-sm">YouTube Link</h3>
                <p className="text-xs text-gray-400">Import directly from URL</p>
              </div>
              <ChevronRight className="text-gray-300" />
            </motion.div>

            {materials.length > 0 && (
              <div className="pt-4 space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Recent Sessions</h4>
                <div className="space-y-3">
                  {materials.slice(0, 3).map((m) => (
                    <motion.button 
                      key={m.id}
                      whileHover={{ x: 5 }}
                      onClick={() => { setSelectedMaterial(m); setActiveView('study'); }}
                      className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BrainCircuit size={18} /></div>
                        <span className="font-bold text-gray-900 text-sm text-left truncate max-w-[180px]">{m.title}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LearningHub;
