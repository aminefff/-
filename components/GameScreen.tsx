
import React, { useState, useEffect } from 'react';
import { MONEY_LADDER } from '../constants';
import { Question, Lifelines } from '../types';
import { Users, Phone, ShieldCheck, CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';
import { playClickSound, playCorrectSound, playLifelineSound, playWrongSound } from '../utils/audio';

interface GameScreenProps {
  questions: Question[];
  onGameOver: (amountWon: string, numericValue: number) => void;
  onVictory: (amountWon: string, numericValue: number) => void;
  onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ questions, onGameOver, onVictory, onExit }) => {
  const maxLevels = Math.min(15, questions.length);
  const activeLadder = MONEY_LADDER.slice().reverse().slice(0, maxLevels).reverse(); 
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'selected' | 'revealed'>('waiting');
  const [lifelines, setLifelines] = useState<Lifelines>({ fiftyFifty: true, askAudience: true, callFriend: true });
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [timer, setTimer] = useState(45);
  const [audienceData, setAudienceData] = useState<number[] | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentLevel = currentQuestionIndex + 1;

  useEffect(() => {
    if (gameState !== 'waiting') return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, currentQuestionIndex]);

  const handleTimeOut = () => {
    playWrongSound();
    const safeData = getSafeAmountData(currentQuestionIndex);
    onGameOver(safeData.amount, safeData.value);
  };

  const getSafeAmountData = (index: number): { amount: string, value: number } => {
    if (index === 0) return { amount: "0", value: 0 };
    const safeTier = activeLadder
        .filter(t => t.level <= index && t.isSafeHaven)
        .sort((a, b) => b.level - a.level)[0];
    if (safeTier) return { amount: safeTier.amount, value: safeTier.value };
    return { amount: "0", value: 0 };
  };

  const handleOptionSelect = (index: number) => {
    if (gameState !== 'waiting' || disabledOptions.includes(index)) return;
    playClickSound();
    setSelectedOption(index);
    setGameState('selected');

    setTimeout(() => {
      setGameState('revealed');
      
      if (index === currentQuestion.correctAnswerIndex) {
        playCorrectSound();
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            handleNextLevel();
          } else {
            const finalTier = activeLadder.find(t => t.level === questions.length);
            onVictory(finalTier?.amount || "1,000,000", finalTier?.value || 1000000);
          }
        }, 2000);
      } else {
        playWrongSound();
        setTimeout(() => {
          const safeData = getSafeAmountData(currentQuestionIndex);
          onGameOver(safeData.amount, safeData.value);
        }, 2000);
      }
    }, 1500);
  };

  const handleNextLevel = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setGameState('waiting');
    setDisabledOptions([]);
    setAudienceData(null);
    setTimer(45);
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || gameState !== 'waiting') return;
    playLifelineSound();
    const correct = currentQuestion.correctAnswerIndex;
    let wrongOptions = [0, 1, 2, 3].filter(i => i !== correct);
    const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    const toDisable = wrongOptions.filter(i => i !== randomWrong);
    setDisabledOptions(toDisable);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
  };

  const useAskAudience = () => {
    if (!lifelines.askAudience || gameState !== 'waiting') return;
    playLifelineSound();
    const correct = currentQuestion.correctAnswerIndex;
    let data = [0, 0, 0, 0];
    let remainingPercentage = 100;
    const correctPercentage = Math.floor(Math.random() * 30) + 40; 
    data[correct] = correctPercentage;
    remainingPercentage -= correctPercentage;
    [0, 1, 2, 3].forEach(i => {
      if (i !== correct) {
        if (i === 3) data[i] = remainingPercentage;
        else {
            const val = Math.floor(Math.random() * remainingPercentage);
            data[i] = val;
            remainingPercentage -= val;
        }
      }
    });
    setAudienceData(data);
    setLifelines(prev => ({ ...prev, askAudience: false }));
  };

  const useCallFriend = () => {
    if (!lifelines.callFriend || gameState !== 'waiting') return;
    playLifelineSound();
    const correct = currentQuestion.correctAnswerIndex;
    const friendSays = Math.random() > 0.2 ? correct : Math.floor(Math.random() * 4);
    alert(`صديقك يقول: "أعتقد أن الإجابة الصحيحة هي ${currentQuestion.options[friendSays]}"`);
    setLifelines(prev => ({ ...prev, callFriend: false }));
  };

  // 3D Button Styles for Options
  const getOptionClasses = (index: number) => {
    const baseClasses = "relative group w-full p-4 md:p-6 rounded-xl border-b-[6px] transition-all duration-200 flex items-center gap-4 active:translate-y-[6px] active:border-b-0 shadow-md";
    
    if (gameState === 'revealed') {
      if (index === currentQuestion.correctAnswerIndex) 
        return `${baseClasses} bg-green-500 border-green-700 text-white`;
      if (index === selectedOption) 
        return `${baseClasses} bg-red-500 border-red-700 text-white`;
    }
    
    if (gameState === 'selected' && index === selectedOption) 
      return `${baseClasses} bg-blue-600 dark:bg-yellow-600 border-blue-800 dark:border-yellow-800 text-white translate-y-[2px] border-b-[4px]`;
      
    // Default state
    return `${baseClasses} bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-950 hover:bg-slate-50 dark:hover:bg-neutral-700 text-slate-800 dark:text-white`;
  };

  const handleExitClick = () => {
    playClickSound();
    if(window.confirm('هل أنت متأكد من رغبتك في الانسحاب؟ ستخسر تقدمك الحالي.')) {
        onExit();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto p-2 lg:p-6 gap-6 relative">
      
      {/* Quit Button */}
      <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={handleExitClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/50 hover:bg-red-100 dark:hover:bg-red-900 border-b-4 border-red-100 dark:border-red-950 active:border-b-0 active:translate-y-1 rounded-lg text-red-500 dark:text-red-200 transition-all text-sm font-bold shadow-sm"
          >
              <LogOut className="w-4 h-4" />
              <span>انسحاب</span>
          </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center mt-12 lg:mt-0">
        
        {/* Timer & Headers */}
        <div className="flex justify-end lg:justify-between items-center mb-8 px-4">
             <div className="hidden lg:flex items-center gap-2 bg-white/80 dark:bg-neutral-800/80 px-4 py-2 rounded-full border border-slate-200 dark:border-neutral-700 shadow-lg">
                <span className="text-blue-600 dark:text-yellow-500 font-bold text-sm">السؤال {currentQuestionIndex + 1}/{questions.length}</span>
             </div>
             <div className={`flex items-center gap-2 px-6 py-3 rounded-full border-b-4 font-mono text-2xl font-bold shadow-xl transition-colors
                ${timer < 10 
                    ? 'bg-red-500 border-red-700 text-white animate-pulse' 
                    : 'bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-950 text-slate-900 dark:text-white'
                }`}
             >
                <Clock className="w-6 h-6" />
                <span>{timer}</span>
             </div>
        </div>

        {/* Question Bubble */}
        <div className="relative mb-8 group mx-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-yellow-600 dark:to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-neutral-900 border-2 border-blue-100 dark:border-yellow-500/50 rounded-2xl p-6 md:p-10 text-center shadow-2xl">
                <p className="text-xs text-slate-400 dark:text-gray-500 mb-2 font-mono tracking-wide">{currentQuestion.subject} / {currentQuestion.chapter}</p>
                <p className="text-xl md:text-3xl font-bold leading-relaxed text-slate-800 dark:text-white" style={{ lineHeight: '1.6' }}>
                    {currentQuestion.text}
                </p>
            </div>
        </div>

        {/* Audience Graph */}
        {audienceData && (
             <div className="mb-6 flex justify-center gap-4 h-32 items-end bg-white/90 dark:bg-neutral-900/90 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 mx-4 animate-fadeIn shadow-lg">
                {audienceData.map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 w-8">
                        <span className="text-xs text-slate-500 dark:text-gray-400">{val}%</span>
                        <div className="w-full bg-blue-500 dark:bg-yellow-500 transition-all duration-1000 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ height: `${val}%` }}></div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                            {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                        </span>
                    </div>
                ))}
             </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={disabledOptions.includes(idx) || gameState !== 'waiting'}
              onClick={() => handleOptionSelect(idx)}
              className={`
                ${getOptionClasses(idx)}
                ${disabledOptions.includes(idx) ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 font-bold shrink-0 text-slate-500 dark:text-gray-400">
                {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
              </div>
              <span className="text-lg md:text-xl font-medium text-right flex-1">{opt}</span>
              
              {gameState === 'revealed' && idx === currentQuestion.correctAnswerIndex && (
                  <CheckCircle className="w-6 h-6 animate-bounce" />
              )}
              {gameState === 'revealed' && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                  <XCircle className="w-6 h-6" />
              )}
            </button>
          ))}
        </div>
        
        {/* Mobile Lifelines */}
        <div className="flex lg:hidden justify-center gap-4 mt-8 pb-8">
            <LifelineButton icon={<span className="font-bold text-xs">50:50</span>} active={lifelines.fiftyFifty} onClick={useFiftyFifty} label="حذف إجابتين" />
            <LifelineButton icon={<Users className="w-5 h-5" />} active={lifelines.askAudience} onClick={useAskAudience} label="رأي الجمهور" />
            <LifelineButton icon={<Phone className="w-5 h-5" />} active={lifelines.callFriend} onClick={useCallFriend} label="اتصال بصديق" />
        </div>
      </div>

      {/* Sidebar / Ladder */}
      <div className="hidden lg:flex flex-col w-80 bg-white dark:bg-neutral-900 border-l-4 border-slate-200 dark:border-neutral-950 p-4 rounded-xl shadow-2xl overflow-hidden h-fit self-center transition-colors">
        
        <div className="flex justify-between mb-6 pb-6 border-b border-slate-200 dark:border-neutral-800">
             <LifelineButton icon={<span className="font-bold text-lg">50:50</span>} active={lifelines.fiftyFifty} onClick={useFiftyFifty} label="حذف إجابتين" />
             <LifelineButton icon={<Users className="w-6 h-6" />} active={lifelines.askAudience} onClick={useAskAudience} label="الجمهور" />
             <LifelineButton icon={<Phone className="w-6 h-6" />} active={lifelines.callFriend} onClick={useCallFriend} label="صديق" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar max-h-[60vh]">
            {activeLadder.map((tier) => (
                <div 
                    key={tier.level}
                    className={`flex justify-between items-center px-4 py-2 rounded-lg transition-colors
                        ${tier.level === currentQuestionIndex + 1 
                            ? 'bg-blue-600 dark:bg-yellow-600 text-white font-bold scale-105 shadow-lg border border-blue-400 dark:border-yellow-400' 
                            : ''}
                        ${tier.level < currentQuestionIndex + 1 
                            ? 'text-slate-400 dark:text-gray-600 bg-slate-50 dark:bg-neutral-900' 
                            : ''}
                        ${tier.level > currentQuestionIndex + 1 
                            ? 'text-blue-400/70 dark:text-yellow-500/70' 
                            : ''}
                        ${tier.isSafeHaven && tier.level !== currentQuestionIndex + 1 
                            ? 'text-slate-900 dark:text-white font-semibold' 
                            : ''}
                    `}
                >
                    <span className="text-xs opacity-50">{tier.level}</span>
                    <div className="flex items-center gap-2">
                        {tier.isSafeHaven && <ShieldCheck className="w-4 h-4 opacity-50" />}
                        <span className="tracking-wider">{tier.amount}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const LifelineButton = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
    <button 
        onClick={onClick}
        disabled={!active}
        className={`relative group flex flex-col items-center justify-center w-16 h-16 rounded-full border-b-[4px] transition-all active:translate-y-[4px] active:border-b-0
            ${active 
                ? 'bg-blue-500 dark:bg-yellow-500 border-blue-700 dark:border-yellow-700 text-white dark:text-black hover:bg-blue-400 dark:hover:bg-yellow-400 cursor-pointer shadow-md' 
                : 'bg-slate-200 dark:bg-neutral-800 border-slate-300 dark:border-neutral-950 text-slate-400 dark:text-neutral-600 cursor-not-allowed'}
        `}
        title={label}
    >
        {!active && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-0.5 bg-red-600 rotate-45 absolute opacity-80"></div>
                <div className="w-full h-0.5 bg-red-600 -rotate-45 absolute opacity-80"></div>
            </div>
        )}
        {icon}
    </button>
);

export default GameScreen;