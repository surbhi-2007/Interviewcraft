import React, { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import InterviewRoom from './components/InterviewRoom';
import Scorecard from './components/Scorecard';
import HistoryPage from './components/HistoryPage';
import ProgressPage from './components/ProgressPage';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { Sparkles, History, TrendingUp, ShieldCheck, LogIn, LogOut, Play, UserCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'history' | 'progress' | 'admin'
  const [practiceStep, setPracticeStep] = useState('setup'); // 'setup' | 'room' | 'scorecard'
  const [sessionData, setSessionData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('interviewcraft_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('interviewcraft_user', JSON.stringify(user));
      if (token) localStorage.setItem('interviewcraft_token', token);
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('interviewcraft_user');
      localStorage.removeItem('interviewcraft_token');
    } catch (e) {}
  };

  const handleStartSession = (config) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setSessionData({ ...config, userId: currentUser.id });
    setPracticeStep('room');
  };

  const handleEndSession = (history, jobTitle) => {
    const sessId = sessionData?.sessionId || 'demo';
    fetch(`https://interviewcraft-1-2c1q.onrender.com/api/interviews/${sessId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        history, 
        jobTitle, 
        userId: currentUser?.id 
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.feedback) setFeedback(data.feedback);
        setPracticeStep('scorecard');
      })
      .catch(err => {
        console.warn('Backend evaluation fallback used:', err);
        setPracticeStep('scorecard');
      });
  };

  const handleRestartPractice = () => {
    setSessionData(null);
    setFeedback(null);
    setPracticeStep('setup');
    setActiveTab('practice');
  };

  const handleTabClick = (tabId) => {
    if ((tabId === 'history' || tabId === 'progress' || tabId === 'practice') && !currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Global Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleRestartPractice}>
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">InterviewCraft</span>
              <span className="hidden sm:inline-flex text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full ml-2">Database Integrated</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[
              { id: 'practice', label: 'Practice Room', icon: Play },
              { id: 'history', label: 'Interview History', icon: History },
              { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
              { id: 'admin', label: 'Admin Portal', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition ${
                    active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth Profile Area */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold leading-tight">{currentUser.targetRole || 'Candidate'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 transition ml-2"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 sm:px-4 py-2 rounded-xl whitespace-nowrap transition shadow-sm"
              >
                <LogIn className="w-4 h-4" /> Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'practice' && (
          <>
            {practiceStep === 'setup' && (
              <SetupScreen 
                currentUser={currentUser} 
                onStartSession={handleStartSession} 
                onOpenAuth={() => setIsAuthOpen(true)} 
              />
            )}
            {practiceStep === 'room' && (
              <InterviewRoom 
                sessionData={sessionData} 
                onEndSession={handleEndSession} 
              />
            )}
            {practiceStep === 'scorecard' && (
              <Scorecard 
                feedback={feedback} 
                onRestart={handleRestartPractice} 
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <HistoryPage 
            currentUser={currentUser}
            onSelectSession={(fb) => { setFeedback(fb); setPracticeStep('scorecard'); setActiveTab('practice'); }}
            onNewPractice={handleRestartPractice}
          />
        )}

        {activeTab === 'progress' && <ProgressPage currentUser={currentUser} />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
