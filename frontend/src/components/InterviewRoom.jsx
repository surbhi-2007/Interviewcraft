import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Square, Sparkles, CheckCircle2, Clock, Flame, Smile, Briefcase, RefreshCw, HelpCircle } from 'lucide-react';

export default function InterviewRoom({ sessionData, onEndSession }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [starState, setStarState] = useState({
    situation: false,
    task: false,
    action: false,
    result: false
  });

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('/api/interviews/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    })
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        setMessages([{ sender: 'ai', text: data.openingQuestion }]);
        speakText(data.openingQuestion);
      })
      .catch(err => {
        if (!isMounted) return;
        const fallback = `Welcome to your practice interview for the ${sessionData.jobTitle} (${sessionData.experienceLevel}) role! I'm your interviewer today (${sessionData.personality}). Tell me about a project or achievement you are proud of.`;
        setMessages([{ sender: 'ai', text: fallback }]);
        speakText(fallback);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const text = input.toLowerCase();
    const fillers = (text.match(/\b(um|uh|like|you know|basically|actually)\b/g) || []).length;
    setFillerCount(fillers);

    setStarState({
      situation: /\b(when|project|client|company|background|time|situation)\b/.test(text),
      task: /\b(task|goal|responsible|objective|needed to|assigned)\b/.test(text),
      action: /\b(i created|i built|i designed|i led|i implemented|i analyzed|action)\b/.test(text),
      result: /\b(result|outcome|increased|reduced|saved|achieved|improved|percent|%)\b/.test(text)
    });
  }, [input]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Web Speech API is not supported in this browser. Please type your response.');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => prev + ' ' + transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    }
  };

  const speakText = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'user', text: input };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    const textToSend = input;
    setInput('');
    setLoading(true);

    fetch(`/api/interviews/${sessionData.sessionId || 'demo'}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: textToSend,
        personality: sessionData.personality,
        jobTitle: sessionData.jobTitle,
        history: updatedHistory
      })
    })
      .then(res => res.json())
      .then(data => {
        const aiReply = data.aiReply || "That sounds great! Could you elaborate on how you measured the final outcome?";
        setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
        speakText(aiReply);
      })
      .catch(err => {
        const fallback = "Thanks for sharing! What was the biggest lesson you learned from that experience?";
        setMessages(prev => [...prev, { sender: 'ai', text: fallback }]);
        speakText(fallback);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">Interview Room</h1>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>Target: <strong className="text-slate-800">{sessionData.jobTitle}</strong> ({sessionData.experienceLevel})</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                {sessionData.personality === 'Coach' && <Smile className="w-3.5 h-3.5" />}
                {sessionData.personality === 'Challenger' && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                {sessionData.personality === 'Professional' && <Briefcase className="w-3.5 h-3.5 text-indigo-600" />}
                {sessionData.personality} Mode
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatTime(timer)}</span>
          </div>

          <button 
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
            title="Toggle Voice Readout"
          >
            {ttsEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => onEndSession(messages, sessionData.jobTitle)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-xs transition shadow-md shadow-red-600/20"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            Finish & View Scorecard
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Chat Window */}
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-slate-100'
                }`}>
                  <p className="font-semibold text-xs opacity-75 mb-1.5">
                    {msg.sender === 'user' ? 'You' : `Interviewer (${sessionData.personality})`}
                  </p>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" /> AI Interviewer is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Controls */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
              <button 
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition ${
                  isRecording 
                    ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/30' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-600" />}
              </button>

              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your response or use your microphone out loud..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none px-2"
              />

              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition shadow-md shadow-indigo-600/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <aside className="w-80 bg-white border-l border-slate-200 p-6 space-y-6 flex flex-col shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Live STAR Helper
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">Checkmarks light up as you structure your story:</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Situation', active: starState.situation },
                { label: 'Task', active: starState.task },
                { label: 'Action', active: starState.action },
                { label: 'Result', active: starState.result },
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  item.active 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <span className="text-xs">{item.label}</span>
                  <CheckCircle2 className={`w-4 h-4 ${item.active ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filler Word Counter</h4>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-extrabold text-indigo-600">{fillerCount}</span>
              <span className="text-xs text-slate-500">words flagged</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal pt-1">Monitors "um", "like", "you know", "basically".</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
