
import React, { useState } from 'react';
import { Question } from '../types';
import { Play, Book, Layers, FileText, ChevronLeft } from 'lucide-react';

interface SelectionScreenProps {
  questions: Question[];
  onStartGame: (filteredQuestions: Question[]) => void;
  onBack: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ questions, onStartGame, onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');

  const subjects = Array.from(new Set(questions.map(q => q.subject)));
  
  const chapters = selectedSubject 
    ? Array.from(new Set(questions.filter(q => q.subject === selectedSubject).map(q => q.chapter)))
    : [];

  const lessons = selectedChapter
    ? Array.from(new Set(questions.filter(q => q.chapter === selectedChapter).map(q => q.lesson)))
    : [];

  const handleStart = () => {
    let filtered = questions;
    if (selectedSubject) filtered = filtered.filter(q => q.subject === selectedSubject);
    if (selectedChapter) filtered = filtered.filter(q => q.chapter === selectedChapter);
    if (selectedLesson) filtered = filtered.filter(q => q.lesson === selectedLesson);

    if (filtered.length === 0) {
      alert("لا توجد أسئلة بهذا التصنيف حالياً");
      return;
    }
    onStartGame(filtered);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-fadeIn">
       <button onClick={onBack} className="absolute top-6 right-6 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-neutral-900 px-4 py-2 rounded-lg transition-colors">
         <ChevronLeft className="w-5 h-5" />
         <span>عودة</span>
       </button>

       <div className="text-center mb-10">
         <h2 className="text-3xl font-black text-blue-600 dark:text-yellow-500 mb-2 drop-shadow-md">اختر مجال التحدي</h2>
         <p className="text-slate-500 dark:text-gray-400">حدد المادة والدرس الذي تريد مراجعته</p>
       </div>

       <div className="w-full max-w-md space-y-6">
         {/* Subject */}
         <div className="space-y-2">
            <label className="flex items-center gap-2 text-blue-600 dark:text-yellow-500 font-bold">
                <Book className="w-4 h-4" /> المادة
            </label>
            <div className="relative">
                <select 
                    value={selectedSubject} 
                    onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedChapter('');
                        setSelectedLesson('');
                    }}
                    className="w-full bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white p-4 rounded-xl outline-none focus:border-blue-500 dark:focus:border-yellow-500 transition-colors cursor-pointer appearance-none shadow-sm"
                >
                    <option value="">كل المواد (ثقافة عامة)</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-gray-500">▼</div>
            </div>
         </div>

         {/* Chapter */}
         <div className={`space-y-2 transition-all duration-300 ${!selectedSubject ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
            <label className="flex items-center gap-2 text-blue-600 dark:text-yellow-500 font-bold">
                <Layers className="w-4 h-4" /> الفصل
            </label>
            <div className="relative">
                <select 
                    value={selectedChapter} 
                    onChange={(e) => {
                        setSelectedChapter(e.target.value);
                        setSelectedLesson('');
                    }}
                    className="w-full bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white p-4 rounded-xl outline-none focus:border-blue-500 dark:focus:border-yellow-500 transition-colors cursor-pointer appearance-none shadow-sm"
                >
                    <option value="">كل الفصول</option>
                    {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-gray-500">▼</div>
            </div>
         </div>

         {/* Lesson */}
         <div className={`space-y-2 transition-all duration-300 ${!selectedChapter ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
            <label className="flex items-center gap-2 text-blue-600 dark:text-yellow-500 font-bold">
                <FileText className="w-4 h-4" /> الدرس
            </label>
            <div className="relative">
                <select 
                    value={selectedLesson} 
                    onChange={(e) => setSelectedLesson(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white p-4 rounded-xl outline-none focus:border-blue-500 dark:focus:border-yellow-500 transition-colors cursor-pointer appearance-none shadow-sm"
                >
                    <option value="">كل الدروس</option>
                    {lessons.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-gray-500">▼</div>
            </div>
         </div>

         <button
            onClick={handleStart}
            className="w-full mt-8 bg-blue-600 dark:bg-white hover:bg-blue-500 dark:hover:bg-gray-100 text-white dark:text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 border-b-[6px] border-blue-800 dark:border-gray-400 active:border-b-0 active:translate-y-[6px] transition-all shadow-lg"
         >
            <Play className="fill-white dark:fill-black" />
            <span>بدء اللعبة</span>
         </button>
       </div>
    </div>
  );
};

export default SelectionScreen;