import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Flame, Target, CheckCircle2, Zap, RefreshCw } from 'lucide-react';

export default function ProgressPage({ currentUser }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/interviews/progress/${currentUser.id}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
      })
      .catch(err => {
        console.warn('Failed to load progress analytics:', err);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const totalSessions = data?.totalSessions || 0;
  const avgScore = data?.avgScore || '0.0';
  const streakDays = data?.streakDays || 0;
  const breakdown = data?.skillBreakdown || { structure: 0, clarity: 0, relevance: 0 };

  const stats = [
    { title: 'Completed Sessions', value: `${totalSessions}`, subtitle: 'Saved in Database' },
    { title: 'Average Overall Score', value: `${avgScore} / 10`, subtitle: 'Calculated performance' },
    { title: 'Practice Streak', value: `${streakDays} Days 🔥`, subtitle: 'Active practice' },
    { title: 'STAR Accuracy', value: `${breakdown.structure}%`, subtitle: 'Situation clarity' }
  ];

  const skillBreakdown = [
    { name: 'STAR Method Structure', score: breakdown.structure, color: 'bg-indigo-600' },
    { name: 'Clarity & Delivery', score: breakdown.clarity, color: 'bg-emerald-600' },
    { name: 'Relevance to Job Role', score: breakdown.relevance, color: 'bg-sky-600' }
  ];

  const milestones = [
    { name: 'First Steps', desc: 'Completed 1st practice session', date: 'Database Verified', icon: Target, unlocked: totalSessions >= 1 },
    { name: 'STAR Storyteller', desc: 'Achieved 8.0+ on STAR structure', date: 'Database Verified', icon: Award, unlocked: totalSessions >= 2 },
    { name: 'Filler Word Master', desc: 'Finished session with minimal filler words', date: 'Database Verified', icon: Zap, unlocked: totalSessions >= 3 },
    { name: 'Interview Pro', desc: 'Complete 10 practice sessions', descLocked: `${Math.max(0, 10 - totalSessions)} sessions remaining`, icon: Flame, unlocked: totalSessions >= 10 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Real-time Database Analytics
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {currentUser ? `${currentUser.name}'s Practice Progress` : 'Practice Progress & Analytics'}
          </h1>
          <p className="text-sm text-slate-500">Track how your interview scores and skills improve over time.</p>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-3 shadow-sm">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Calculating progress from database...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.title}</span>
                  <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
                  <span className="text-xs text-indigo-600 font-semibold">{item.subtitle}</span>
                </div>
              ))}
            </div>

            {/* Score Trend & Competencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Competency Bars */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" /> Skill Competency Breakdown
                </h3>

                <div className="space-y-4">
                  {skillBreakdown.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{skill.name}</span>
                        <span className="text-slate-900">{skill.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${skill.color}`} style={{ width: `${skill.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements / Milestones */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" /> Achievement Milestones
                </h3>

                <div className="space-y-3">
                  {milestones.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${
                        m.unlocked ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-dashed border-slate-200 opacity-60'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${m.unlocked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{m.name}</h4>
                            <p className="text-[11px] text-slate-500">{m.unlocked ? m.desc : m.descLocked}</p>
                          </div>
                        </div>
                        {m.unlocked && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
