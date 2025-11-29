
import React, { useState } from 'react';
import { Question } from '../types';
import { PlusCircle, LogOut, Play, List } from 'lucide-react';

interface AdminDashboardProps {
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onLogout: () => void;
  onPlay: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ questions, onAddQuestion, onLogout, onPlay }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [formData, setFormData] = useState({
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctIndex: 0,
    subject: '',
    chapter: '',
    lesson: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: Question = {
      id: Date.now(),
      text: formData.text,
      options: [formData.option1, formData.option2, formData.option3, formData.option4],
      correctAnswerIndex: formData.correctIndex,
      subject: formData.subject,
      chapter: formData.chapter,
      lesson: formData.lesson,
      difficulty: formData.difficulty,
      prize: "0" // Will be assigned dynamically during game
    };
    onAddQuestion(newQuestion);
    alert('تمت إضافة السؤال بنجاح!');
    setFormData({ ...formData, text: '', option1: '', option2: '', option3: '', option4: '' });
  };

  const subjects = Array.from(new Set(questions.map(q => q.subject)));
  const chapters = Array.from(new Set(questions.filter(q => q.subject === formData.subject).map(q => q.chapter)));
  const lessons = Array.from(new Set(questions.filter(q => q.chapter === formData.chapter).map(q => q.lesson)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white p-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 pb-4 border-b border-slate-200 dark:border-neutral-800 gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-black text-blue-600 dark:text-yellow-500">لوحة تحكم الإدارة</h1>
            <p className="text-slate-500 dark:text-gray-400">إدارة بنك الأسئلة والمحتوى التعليمي</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onPlay} className="px-5 py-3 bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-xl flex items-center gap-2 border-b-4 border-slate-200 dark:border-neutral-950 active:border-b-0 active:translate-y-1 transition-all shadow-sm">
                <Play className="w-4 h-4 text-blue-600 dark:text-yellow-500" />
                <span>تجربة اللعبة</span>
            </button>
            <button onClick={onLogout} className="px-5 py-3 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl flex items-center gap-2 border-b-4 border-red-200 dark:border-red-900 active:border-b-0 active:translate-y-1 transition-all shadow-sm">
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <button
              onClick={() => setActiveTab('add')}
              className={`w-full text-right px-6 py-4 rounded-xl flex items-center gap-3 transition-all border-b-4 active:border-b-0 active:translate-y-1 
                ${activeTab === 'add' 
                    ? 'bg-blue-600 dark:bg-yellow-600 border-blue-800 dark:border-yellow-800 text-white dark:text-black font-bold' 
                    : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-950 text-slate-400 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-neutral-800'}`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>إضافة سؤال جديد</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`w-full text-right px-6 py-4 rounded-xl flex items-center gap-3 transition-all border-b-4 active:border-b-0 active:translate-y-1 
                ${activeTab === 'list' 
                    ? 'bg-blue-600 dark:bg-yellow-600 border-blue-800 dark:border-yellow-800 text-white dark:text-black font-bold' 
                    : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-950 text-slate-400 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-neutral-800'}`}
            >
              <List className="w-5 h-5" />
              <span>عرض جميع الأسئلة ({questions.length})</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
            {activeTab === 'add' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-500 mb-1">المادة</label>
                    <input list="subjects" required className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 p-3 rounded-lg focus:border-blue-500 dark:focus:border-yellow-500 outline-none text-slate-900 dark:text-white" 
                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="مثال: العلوم" />
                    <datalist id="subjects">{subjects.map(s => <option key={s} value={s} />)}</datalist>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-500 mb-1">الفصل</label>
                    <input list="chapters" required className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 p-3 rounded-lg focus:border-blue-500 dark:focus:border-yellow-500 outline-none text-slate-900 dark:text-white" 
                        value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value})} placeholder="مثال: الفيزياء" />
                    <datalist id="chapters">{chapters.map(s => <option key={s} value={s} />)}</datalist>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-500 mb-1">الدرس</label>
                    <input list="lessons" required className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 p-3 rounded-lg focus:border-blue-500 dark:focus:border-yellow-500 outline-none text-slate-900 dark:text-white" 
                        value={formData.lesson} onChange={e => setFormData({...formData, lesson: e.target.value})} placeholder="مثال: السرعة" />
                    <datalist id="lessons">{lessons.map(s => <option key={s} value={s} />)}</datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-500 dark:text-gray-500 mb-1">نص السؤال</label>
                  <textarea required className="w-full bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 p-3 rounded-lg focus:border-blue-500 dark:focus:border-yellow-500 outline-none h-24 text-slate-900 dark:text-white"
                    value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="اكتب السؤال هنا..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="relative">
                            <label className="block text-sm text-slate-500 dark:text-gray-500 mb-1">الخيار {num}</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name="correct" 
                                    checked={formData.correctIndex === num - 1}
                                    onChange={() => setFormData({...formData, correctIndex: num - 1})}
                                    className="accent-blue-600 dark:accent-yellow-500 w-5 h-5"
                                />
                                <input 
                                    required
                                    className={`w-full bg-slate-50 dark:bg-black border p-3 rounded-lg outline-none text-slate-900 dark:text-white ${formData.correctIndex === num - 1 ? 'border-green-500' : 'border-slate-300 dark:border-neutral-700'}`}
                                    // @ts-ignore
                                    value={formData[`option${num}`]}
                                    // @ts-ignore
                                    onChange={e => setFormData({...formData, [`option${num}`]: e.target.value})}
                                    placeholder={`الإجابة ${num}`} 
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm text-slate-500 dark:text-gray-500">الصعوبة:</label>
                        <select 
                            value={formData.difficulty} 
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                            className="bg-slate-50 dark:bg-black border border-slate-300 dark:border-neutral-700 rounded-lg p-2 outline-none text-slate-900 dark:text-white"
                        >
                            <option value="easy">سهل</option>
                            <option value="medium">متوسط</option>
                            <option value="hard">صعب</option>
                        </select>
                    </div>
                    <button type="submit" className="px-8 py-3 bg-blue-600 dark:bg-yellow-500 hover:bg-blue-500 dark:hover:bg-yellow-400 text-white dark:text-black font-bold rounded-xl border-b-[4px] border-blue-800 dark:border-yellow-700 active:border-b-0 active:translate-y-[4px] transition-all">
                        حفظ السؤال
                    </button>
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm text-slate-700 dark:text-gray-300">
                  <thead className="bg-slate-100 dark:bg-black text-blue-600 dark:text-yellow-500">
                    <tr>
                      <th className="p-3 rounded-tr-lg">السؤال</th>
                      <th className="p-3">المادة</th>
                      <th className="p-3">الإجابة الصحيحة</th>
                      <th className="p-3 rounded-tl-lg">الصعوبة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                    {questions.map(q => (
                      <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">
                        <td className="p-3 font-medium">{q.text}</td>
                        <td className="p-3 text-slate-500 dark:text-gray-400">{q.subject} - {q.chapter}</td>
                        <td className="p-3 text-green-600 dark:text-green-500">{q.options[q.correctAnswerIndex]}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${q.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : q.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                                {q.difficulty}
                            </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;