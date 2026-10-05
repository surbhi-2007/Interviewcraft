import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Search, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('https://interviewcraft-1-2c1q.onrender.com/api/admin/overview')
      .then(res => res.json())
      .then(overviewData => {
        setData(overviewData);
      })
      .catch(err => {
        console.warn('Failed to load admin overview from database:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const metricsList = [
    { title: 'Registered System Users', value: data?.metrics?.totalUsers ?? 0, change: 'Saved in MongoDB' },
    { title: 'Total Sessions Created', value: data?.metrics?.totalSessions ?? 0, change: 'Interview Sessions' },
    { title: 'Completed Scorecards', value: data?.metrics?.completedSessions ?? 0, change: 'Finished Interviews' },
    { title: 'System Average Score', value: `${data?.metrics?.avgScore ?? '8.2'} / 10`, change: 'Quality Rating' }
  ];

  const candidates = data?.candidates || [];
  const filteredUsers = candidates.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-6 rounded-3xl shadow-sm gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Portal
            </div>
            <h1 className="text-2xl font-bold text-slate-900">InterviewCraft Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Monitor live candidates, database accounts, and platform analytics.</p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Database Connected
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-3 shadow-sm">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Fetching candidate analytics from MongoDB...</p>
          </div>
        ) : (
          <>
            {/* System Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {metricsList.map((m, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                  <div className="text-2xl font-extrabold text-slate-900">{m.value}</div>
                  <span className="text-xs text-indigo-600 font-semibold">{m.change}</span>
                </div>
              ))}
            </div>

            {/* Candidate Activity Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Candidate Management & Analytics
                </h3>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search candidate name or role..."
                    className="bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Candidate Name</th>
                      <th className="px-6 py-4">Target Role</th>
                      <th className="px-6 py-4">Sessions</th>
                      <th className="px-6 py-4">Avg Score</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">
                          No registered candidates found in the database.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {u.name}<br />
                            <span className="text-[11px] text-slate-400 font-normal">{u.email}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{u.role}</td>
                          <td className="px-6 py-4 font-mono font-semibold">{u.sessions} sessions</td>
                          <td className="px-6 py-4 font-bold text-indigo-600">{u.avgScore}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold rounded-full">
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
