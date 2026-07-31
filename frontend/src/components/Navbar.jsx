import React from 'react';
import { ShieldCheck, UserPlus, LogIn, Database, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendConnected }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 px-4 lg:px-8 py-3.5 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('login')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              Dynamic Graphical Auth
            </h1>
            <p className="text-xs text-indigo-300/70 font-medium">Image Sequence Authentication System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800 shadow-inner">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Login Challenge</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </nav>

        {/* System Health Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/60 border border-gray-800 text-xs font-medium">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${backendConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-500'}`}></div>
          <span className="text-gray-300">
            {backendConnected ? 'Spring Boot Active' : 'Connecting Backend...'}
          </span>
        </div>
      </div>
    </header>
  );
}
