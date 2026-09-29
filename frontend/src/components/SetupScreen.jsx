import React, { useState } from 'react';
import { Sparkles, Briefcase, Upload, FileText, Smile, Flame, UserCheck, Play, HelpCircle, CheckCircle2, Trash2, LogIn } from 'lucide-react';

export default function SetupScreen({ currentUser, onStartSession, onOpenAuth }) {
  const [jobTitle, setJobTitle] = useState('Software Developer');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [personality, setPersonality] = useState('Coach');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file) => {
    if (!file) return;
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result || `Extracted resume content from ${file.name}`;
      setResumeText(typeof text === 'string' ? text.slice(0, 1500) : `Resume file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onStartSession({ jobTitle, experienceLevel, personality, resumeText, fileName: uploadedFile?.name });
  };

  const personalities = [
    {
      id: 'Coach',
      name: 'The Coach',
      tag: 'Recommended for Beginners',
      icon: Smile,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Friendly, encouraging & patient. Gives gentle hints if you pause or get stuck during your answer.'
    },
    {
      id: 'Challenger',
      name: 'The Challenger',
      tag: 'For Practice Mastery',
      icon: Flame,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Asks probing follow-up questions if your answer is too brief or lacks specific data and metrics.'
    },
    {
      id: 'Professional',
      name: 'The Professional',
      tag: 'Formal Interview',
      icon: UserCheck,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Direct, formal, and objective corporate interviewer evaluating against standard key competencies.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4" /> AI Interview Practice Platform
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Prepare For Your Next Job Interview</h1>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
            Choose your target role, pick an interviewer personality, and practice answering out loud with instant AI evaluation.
          </p>
        </div>

        {/* Authentication Notice if not logged in */}
        {!currentUser && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">Authentication Required</h4>
                <p className="text-[11px] text-amber-800">Please log in or sign up to save your interview sessions and scorecards to MongoDB.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm shrink-0"
            >
              Log In / Register Now
            </button>
          </div>
        )}

        {/* Beginner Guidance Card */}
        <div className="bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-indigo-950">First Time Here? How STAR Method Works</h4>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Top companies look for structured answers using the <strong>STAR Method</strong>: 
              <span className="font-semibold text-indigo-950"> Situation</span> (set the scene), 
              <span className="font-semibold text-indigo-950"> Task</span> (explain your goal), 
              <span className="font-semibold text-indigo-950"> Action</span> (describe what YOU did), and 
              <span className="font-semibold text-indigo-950"> Result</span> (share the outcome). Our live helper will guide you step-by-step!
            </p>
          </div>
        </div>

        {/* Main Setup Form Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-8">
          {/* Step 1: Role & Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold">1</span>
              Select Target Role & Experience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Target Job Title
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Software Developer">Software Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Sales Representative">Sales Representative</option>
                  <option value="UX/UI Designer">UX/UI Designer</option>
                  <option value="Marketing Specialist">Marketing Specialist</option>
                  <option value="Customer Support Lead">Customer Support Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Experience Level</label>
                <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl">
                  {['Beginner', 'Mid-level', 'Senior'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                        experienceLevel === level ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Personality Picker */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold">2</span>
              Choose Your AI Interviewer Personality
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalities.map((item) => {
                const Icon = item.icon;
                const selected = personality === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setPersonality(item.id)}
                    className={`cursor-pointer border p-5 rounded-2xl transition flex flex-col justify-between space-y-3 ${
                      selected ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20' : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl border ${item.badgeColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {selected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                        <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">{item.tag}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Resume Upload Feature */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold">3</span>
              Upload Resume for Tailored Questions (Optional)
            </h3>

            {!uploadedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
                  dragActive ? 'border-indigo-500 bg-indigo-50/60' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                }`}
              >
                <div className="p-3 bg-white border border-slate-200 rounded-full text-indigo-600 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Drag and drop your resume file here, or{' '}
                    <label className="text-indigo-600 hover:underline cursor-pointer font-bold">
                      browse
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, or TXT up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">{uploadedFile.name}</h5>
                    <p className="text-[11px] text-emerald-700">Resume parsed successfully • Ready for customized interview</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setUploadedFile(null); setResumeText(''); }}
                  className="p-2 text-emerald-700 hover:text-red-600 transition"
                  title="Remove File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 text-base"
          >
            <Play className="w-5 h-5 fill-current" /> {currentUser ? 'Start Interview Practice' : 'Log In to Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
}
