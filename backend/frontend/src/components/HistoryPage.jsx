import React, { useState, useEffect } from 'react';
import { History, Calendar, ChevronRight, Search, Play, RefreshCw, MessageSquare } from 'lucide-react';

export default function HistoryPage({ currentUser, onSelectSession, onNewPractice }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser?.id) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://interviewcraft-1-2c1q.onrender.com/api/interviews/history/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || []);
      })
      .catch(err => {
        console.warn('Failed to load user history from DB:', err);
        setSessions([]);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const filtered = sessions.filter(s => 
    s.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.personality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-6 rounded-3xl shadow-sm gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-2">
              <History className="w-3.5 h-3.5" /> Database Session Archive
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Your Interview History</h1>
            <p className="text-sm text-slate-500">
              {currentUser ? `Saved practice sessions for ${currentUser.name}` : 'Log in to view your saved interview scorecards.'}
            </p>
          </div>

          <button
            onClick={onNewPractice}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20"
          >
            <Play className="w-4 h-4 fill-current" /> Start New Practice
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history by job role or interviewer personality..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-3 shadow-sm">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Fetching interview history from database...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-900 text-base">No Saved Interview Sessions</h3>
              <p className="text-xs text-slate-500">
                You haven't completed any practice sessions yet. Start a new interview practice to generate your first scorecard!
              </p>
            </div>
            <button
              onClick={onNewPractice}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Launch Practice Room
            </button>
          </div>
        )}

        {/* Sessions List */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.feedback)}
                className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 text-base">{session.jobTitle}</h3>
                    <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                      {session.experienceLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {session.date}</span>
                    <span>•</span>
                    <span>Interviewer: <strong>{session.personality}</strong></span>
                    <span>•</span>
                    <span>Messages: {session.messagesCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Overall Score</div>
                    <div className="text-xl font-extrabold text-indigo-600">{session.score}<span className="text-xs text-slate-400 font-normal">/10</span></div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
