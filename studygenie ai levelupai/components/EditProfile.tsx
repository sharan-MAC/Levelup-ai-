import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Camera, ChevronLeft, Save, AtSign, User, Type } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditProfileProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ChevronLeft size={24} />
        </motion.button>
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h2>
        <div className="w-10" />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={formData.avatarUrl}
            alt="Profile"
            className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-indigo-50 dark:ring-indigo-900/30"
          />
          <motion.label 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl cursor-pointer"
          >
            <Camera size={20} />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </motion.label>
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tap to change photo</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-5"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <AtSign size={18} />
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Bio</label>
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                <Type size={18} />
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white h-32 resize-none"
                placeholder="Tell us about your learning goals..."
              />
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Changes
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EditProfile;
