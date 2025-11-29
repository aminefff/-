
import React, { useState, useRef, useEffect } from 'react';
import { X, User, Trash2, Volume2, Save, Upload, Moon, Sun } from 'lucide-react';
import { User as UserType } from '../types';
import { setGameVolume, playClickSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
  onResetProgress: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUpdateUser, onResetProgress }) => {
  const [name, setName] = useState(user.name);
  const [volume, setVolume] = useState(user.volume ?? 80);
  const [theme, setTheme] = useState<'light'|'dark'>(user.theme ?? 'dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setName(user.name);
        setVolume(user.volume ?? 80);
        setTheme(user.theme ?? 'dark');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedUser = { ...user, name, volume, theme };
    onUpdateUser(updatedUser);
    playClickSound();
    onClose();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseInt(e.target.value);
      setVolume(vol);
      setGameVolume(vol);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border-2 border-blue-600 dark:border-yellow-600 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative transition-colors duration-300">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-neutral-800 p-4 flex justify-between items-center border-b border-slate-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-blue-600 dark:text-yellow-500 flex items-center gap-2">
            <User className="w-5 h-5" />
            الإعدادات والملف الشخصي
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 dark:border-yellow-500 shadow-lg bg-slate-200 dark:bg-neutral-800 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400 dark:text-gray-500" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
            />
            <p className="text-xs text-slate-500 dark:text-gray-500">اضغط على الصورة للتغيير</p>
          </div>

          {/* Name Edit */}
          <div className="space-y-2">
            <label className="text-sm text-slate-500 dark:text-gray-400">الاسم الظاهر</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 rounded-xl p-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-yellow-500 outline-none transition-colors"
            />
          </div>

          {/* Theme Toggle */}
          <div className="space-y-2">
             <label className="text-sm text-slate-500 dark:text-gray-400">مظهر التطبيق</label>
             <div className="flex bg-slate-100 dark:bg-black p-1 rounded-xl border border-slate-200 dark:border-neutral-800">
                <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Sun className="w-4 h-4" />
                    <span>فاتح</span>
                </button>
                <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-neutral-800 text-yellow-500 shadow-md' : 'text-gray-600 dark:text-neutral-500 hover:text-gray-400'}`}
                >
                    <Moon className="w-4 h-4" />
                    <span>داكن</span>
                </button>
             </div>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <label className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> مستوى الصوت ({volume}%)
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              onMouseUp={() => playClickSound()}
              className="w-full accent-blue-600 dark:accent-yellow-500 h-2 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-slate-200 dark:border-neutral-800">
             <button 
                onClick={() => {
                    if(window.confirm('هل أنت متأكد من رغبتك في تصفير النقاط؟')) {
                        onResetProgress();
                        onClose();
                    }
                }}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900"
             >
                <Trash2 className="w-4 h-4" />
                <span>إعادة تعيين التقدم</span>
             </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-neutral-800 border-t border-slate-200 dark:border-neutral-700">
            <button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-black font-bold py-3 rounded-xl border-b-4 border-blue-800 dark:border-yellow-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;