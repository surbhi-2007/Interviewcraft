import React from 'react';
import { Trophy, CheckCircle, RefreshCw, BarChart2, MessageSquare, AlertCircle } from 'lucide-react';

export default function Scorecard({ feedback = null, onRestart }) {
  if (!feedback) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-8 flex items-center justify-center font-sans">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Scorecard Data Available</h2>
          <p className="text-xs text-slate-500">Please complete an interview practice session to view your AI performance scorecard.</p>
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl transition"
          >
            Start Practice Interview
          </button>
        </div>
      </div>
    );
  }

  const data = feedback;
  const scores = data.scores || { overall: 0, clarity: 0, relevance: 0, structure: 0 };
  const keyStrengths = data.keyStrengths || [];
  const areasToImprove = data.areasToImprove || [];
  const trySayingItLikeThis = data.trySayingItLikeThis || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-6 rounded-3xl shadow-sm gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-2">
              <Trophy className="w-3.5 h-3.5" /> Performance Report Card
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Interview Practice Scorecard</h1>
            <p className="text-sm text-slate-500">Detailed AI evaluation of your clarity, structure, and STAR methodology.</p>
          </div>

          <button 
            onClick={onRestart}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Practice Another Session
          </button>
        </header>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Overall Score', score: scores.overall, color: 'text-indigo-600', bg: 'bg-indigo-600' },
            { title: 'Clarity', score: scores.clarity, color: 'text-emerald-600', bg: 'bg-emerald-600' },
            { title: 'Relevance', score: scores.relevance, color: 'text-sky-600', bg: 'bg-sky-600' },
            { title: 'STAR Structure', score: scores.structure, color: 'text-purple-600', bg: 'bg-purple-600' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{item.title}</h3>
              <div className={`text-4xl font-black ${item.color} mb-2`}>
                {item.score}<span className="text-base text-slate-400 font-medium">/10</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${item.bg}`} style={{ width: `${(item.score / 10) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" /> Key Strengths
            </h3>
            <ul className="space-y-3">
              {keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-500" /> Areas to Improve
            </h3>
            <ul className="space-y-3">
              {areasToImprove.map((area, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* "Try Saying It Like This" */}
        {trySayingItLikeThis.length > 0 && (
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> "Try Saying It Like This" AI Recommendations
            </h3>

            <div className="space-y-4">
              {trySayingItLikeThis.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-indigo-600">Question: {item.originalQuestion}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-red-900">
                      <span className="font-bold block mb-1 text-red-700">Original Answer:</span>
                      "{item.originalAnswer}"
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
                      <span className="font-bold block mb-1 text-emerald-700">Suggested Polish:</span>
                      "{item.suggestedRewrite}"
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic">💡 {item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
