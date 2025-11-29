
import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import SelectionScreen from './components/SelectionScreen';
import { GameState, Question, User } from './types';
import { INITIAL_QUESTIONS, ADMIN_EMAIL, ADMIN_PASS } from './constants';
import { setGameVolume } from './utils/audio';

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>(GameState.AUTH);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [finalPrize, setFinalPrize] = useState("0");
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- INIT DATA ---
  useEffect(() => {
    // 1. Load Users from LocalStorage
    const storedUsers = localStorage.getItem('sm_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
        // Create Admin User if not exists
        const adminUser: User = {
            id: 'admin_1',
            name: 'المدير',
            email: ADMIN_EMAIL,
            password: ADMIN_PASS,
            role: 'admin',
            totalEarnings: 0,
            volume: 80,
            theme: 'dark' // Default to dark
        };
        setUsers([adminUser]);
        localStorage.setItem('sm_users', JSON.stringify([adminUser]));
    }

    // 2. Load Questions from LocalStorage
    const storedQuestions = localStorage.getItem('sm_questions');
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      setQuestions(INITIAL_QUESTIONS);
      localStorage.setItem('sm_questions', JSON.stringify(INITIAL_QUESTIONS));
    }
  }, []);

  // --- THEME MANAGEMENT ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (currentUser?.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [currentUser?.theme]);

  // --- AUTH HANDLERS ---
  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      // Init Volume
      if (user.volume !== undefined) {
          setGameVolume(user.volume);
      } else {
          setGameVolume(80);
      }

      if (user.role === 'admin') {
        setGameState(GameState.ADMIN);
      } else {
        setGameState(GameState.START);
      }
    } else {
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const handleRegister = (name: string, email: string, pass: string) => {
    if (users.find(u => u.email === email)) {
      alert('هذا البريد مسجل مسبقاً');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: pass,
      role: 'user',
      totalEarnings: 0,
      volume: 80,
      theme: 'dark'
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('sm_users', JSON.stringify(updatedUsers));
    
    setGameVolume(80);
    setCurrentUser(newUser);
    setGameState(GameState.START);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setGameState(GameState.AUTH);
  };

  // --- USER UPDATE HANDLERS ---
  const handleUpdateUser = (updatedUser: User) => {
    if (!currentUser) return;
    const newUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(newUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem('sm_users', JSON.stringify(newUsers));
    if (updatedUser.volume !== undefined) {
        setGameVolume(updatedUser.volume);
    }
  };

  const handleResetProgress = () => {
    if (!currentUser) return;
    handleUpdateUser({ ...currentUser, totalEarnings: 0 });
  };

  // --- ADMIN HANDLERS ---
  const handleAddQuestion = (q: Question) => {
    const updatedQuestions = [...questions, q];
    setQuestions(updatedQuestions);
    localStorage.setItem('sm_questions', JSON.stringify(updatedQuestions));
  };

  // --- GAME FLOW HANDLERS ---
  const goToSelection = () => {
    setGameState(GameState.SELECTION);
  };

  const startGame = (selectedQuestions: Question[]) => {
    const shuffled = [...selectedQuestions].sort(() => 0.5 - Math.random());
    const finalSet = shuffled.slice(0, 15);
    const difficultyMap = { 'easy': 1, 'medium': 2, 'hard': 3 };
    finalSet.sort((a, b) => difficultyMap[a.difficulty] - difficultyMap[b.difficulty]);

    setFilteredQuestions(finalSet);
    setFinalPrize("0");
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (amount: string, numericValue: number) => {
    setFinalPrize(amount);
    updateScore(numericValue);
    setGameState(GameState.GAME_OVER);
  };

  const handleVictory = (amount: string, numericValue: number) => {
    setFinalPrize(amount);
    updateScore(numericValue);
    setGameState(GameState.VICTORY);
  };

  const handleExitGame = () => {
    setGameState(GameState.START);
  };

  const updateScore = (points: number) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, totalEarnings: currentUser.totalEarnings + points };
    handleUpdateUser(updatedUser);
  };

  const restartGame = () => {
    setGameState(GameState.START);
  };

  return (
    <main className="min-h-screen w-full overflow-hidden relative selection:bg-blue-500 dark:selection:bg-yellow-500 selection:text-white dark:selection:text-black font-cairo bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-100 dark:from-neutral-800/20 dark:via-black dark:to-black z-0 pointer-events-none transition-colors duration-500"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Content Container */}
        <div className="flex-1 w-full h-full">
            
            {gameState === GameState.AUTH && (
                <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
            )}

            {gameState === GameState.ADMIN && (
                <AdminDashboard 
                    questions={questions} 
                    onAddQuestion={handleAddQuestion} 
                    onLogout={handleLogout}
                    onPlay={() => setGameState(GameState.SELECTION)}
                />
            )}

            {gameState === GameState.START && currentUser && (
                <StartScreen 
                    onStart={goToSelection} 
                    currentUser={currentUser}
                    isAdmin={currentUser.role === 'admin'}
                    onAdminPanel={() => setGameState(GameState.ADMIN)}
                    onLogout={handleLogout}
                    onUpdateUser={handleUpdateUser}
                    onResetProgress={handleResetProgress}
                />
            )}

            {gameState === GameState.SELECTION && (
                <SelectionScreen 
                    questions={questions} 
                    onStartGame={startGame} 
                    onBack={() => setGameState(GameState.START)}
                />
            )}
            
            {gameState === GameState.PLAYING && (
                <GameScreen 
                    questions={filteredQuestions} 
                    onGameOver={handleGameOver}
                    onVictory={handleVictory}
                    onExit={handleExitGame}
                />
            )}
            
            {(gameState === GameState.GAME_OVER || gameState === GameState.VICTORY) && (
                <ResultScreen 
                    amountWon={finalPrize} 
                    isVictory={gameState === GameState.VICTORY} 
                    onRestart={restartGame} 
                />
            )}
        </div>
        
        {/* Footer */}
        {gameState !== GameState.AUTH && (
            <div className="w-full p-4 text-center text-slate-500 dark:text-neutral-500 text-xs">
                © 2024 Study Millionaire. Designed for Learning.
            </div>
        )}
      </div>
    </main>
  );
};

export default App;