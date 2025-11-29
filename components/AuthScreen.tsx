
import React, { useState } from 'react';
import { User, Lock, Mail, UserPlus, LogIn } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (name: string, email: string, pass: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-6 bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 dark:text-yellow-500 mb-2 drop-shadow-lg">الدراسة المليونية</h1>
          <p className="text-slate-500 dark:text-gray-400">سجل دخولك لبدء التحدي وجمع النقاط</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
           <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 dark:from-yellow-600 dark:via-yellow-400 dark:to-yellow-600"></div>

          <div className="flex mb-8 bg-slate-100 dark:bg-black rounded-xl p-1.5 border border-slate-200 dark:border-neutral-800">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-all font-bold 
                  ${isLogin 
                      ? 'bg-blue-600 dark:bg-yellow-500 text-white dark:text-black shadow-md' 
                      : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
            >
              تسجيل دخول
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-all font-bold 
                  ${!isLogin 
                      ? 'bg-blue-600 dark:bg-yellow-500 text-white dark:text-black shadow-md' 
                      : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-yellow-500" />
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 rounded-xl py-3 pr-12 pl-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-500 transition-colors"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-yellow-500" />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 rounded-xl py-3 pr-12 pl-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-yellow-500" />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 rounded-xl py-3 pr-12 pl-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 dark:bg-yellow-500 hover:bg-blue-500 dark:hover:bg-yellow-400 text-white dark:text-black font-bold py-4 rounded-xl border-b-[6px] border-blue-800 dark:border-yellow-700 active:border-b-0 active:translate-y-[6px] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              <span>{isLogin ? 'دخول' : 'إنشاء الحساب'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;