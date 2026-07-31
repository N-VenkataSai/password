import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ShieldCheck, Lock, RefreshCw, CheckCircle2, XCircle, Grid, RotateCcw, Award, ArrowRight } from 'lucide-react';

export default function Login({ API_BASE, initialUsername, registeredUsers, fetchUsers }) {
  const [username, setUsername] = useState(initialUsername || '');
  const [gridSize, setGridSize] = useState(9); // 9 (3x3) or 16 (4x4)
  const [session, setSession] = useState(null); // { sessionId, currentStep, gridImages, totalSteps }
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [statusState, setStatusState] = useState('IDLE'); // IDLE, CHALLENGE, SUCCESS, FAILED
  const [message, setMessage] = useState('');
  const [shakeGrid, setShakeGrid] = useState(false);

  useEffect(() => {
    fetchUsers();
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  const handleStartLogin = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setMessage('Please select or type a username.');
      return;
    }

    setLoading(true);
    setMessage('');
    setStatusState('IDLE');

    try {
      const res = await fetch(`${API_BASE}/auth/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          gridSize: gridSize
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSession({
          sessionId: data.sessionId,
          currentStep: data.currentStep,
          gridImages: data.gridImages,
          totalSteps: data.totalSteps || 5
        });
        setStatusState('CHALLENGE');
        setMessage(data.message);
      } else {
        setStatusState('FAILED');
        setMessage(data.message || 'User not found or password not configured.');
      }
    } catch (err) {
      console.error(err);
      setStatusState('FAILED');
      setMessage('Network error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = async (imageId) => {
    if (verifying || statusState !== 'CHALLENGE' || !session) return;

    setVerifying(true);

    try {
      const res = await fetch(`${API_BASE}/auth/verify-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          selectedImageId: imageId,
          currentStep: session.currentStep,
          gridSize: gridSize
        })
      });

      const data = await res.json();

      if (data.finished) {
        if (data.success) {
          // Final victory! Trigger confetti
          setStatusState('SUCCESS');
          setMessage(data.message);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          // Authentication Failed!
          setShakeGrid(true);
          setTimeout(() => setShakeGrid(false), 600);
          setStatusState('FAILED');
          setMessage(data.message || 'Authentication Failed: Incorrect sequence.');
        }
      } else {
        // Correct step -> shuffle decoys and load next step!
        setSession({
          ...session,
          currentStep: data.currentStep,
          gridImages: data.gridImages
        });
        setMessage(`Correct! Step ${data.currentStep + 1} of 5 loaded.`);
      }
    } catch (err) {
      console.error(err);
      setStatusState('FAILED');
      setMessage('Error verifying challenge response.');
    } finally {
      setVerifying(false);
    }
  };

  const resetChallenge = () => {
    setSession(null);
    setStatusState('IDLE');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
            <Lock className="w-3.5 h-3.5" /> Step 2: Dynamic Multi-Stage Login
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Graphical Login Challenge
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Select your secret 5-image sequence in order. Images and decoy tiles will automatically shuffle after every correct selection.
          </p>
        </div>

        {/* Grid Size Switcher */}
        <div className="flex items-center gap-2 bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800">
          <span className="text-xs text-gray-400 font-semibold px-2 flex items-center gap-1">
            <Grid className="w-3.5 h-3.5" /> Grid:
          </span>
          <button
            onClick={() => { setGridSize(9); resetChallenge(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              gridSize === 9 ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            3 × 3 (9)
          </button>
          <button
            onClick={() => { setGridSize(16); resetChallenge(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              gridSize === 16 ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            4 × 4 (16)
          </button>
        </div>
      </div>

      {/* Login Setup / Challenge Box */}
      {statusState === 'IDLE' && (
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <form onSubmit={handleStartLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Select Registered User
              </label>
              {registeredUsers.length > 0 ? (
                <select
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-white text-sm font-medium outline-none"
                >
                  <option value="">-- Choose User --</option>
                  {registeredUsers.map((u) => (
                    <option key={u.id} value={u.username}>
                      {u.username} ({u.passwordSequence?.length || 5} images)
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter registered username..."
                  className="w-full bg-gray-900 border border-gray-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-white text-sm font-medium outline-none"
                />
              )}
            </div>

            {message && (
              <p className="text-xs font-semibold text-amber-400 text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Begin Challenge Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Challenge Grid Stage */}
      {statusState === 'CHALLENGE' && session && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                {session.currentStep + 1}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold">User: <span className="text-white">{username}</span></p>
                <h3 className="text-lg font-extrabold text-white">
                  Step {session.currentStep + 1} of {session.totalSteps}
                </h3>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((stepIdx) => (
                <div
                  key={stepIdx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    stepIdx < session.currentStep
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400 scale-110'
                      : stepIdx === session.currentStep
                      ? 'bg-indigo-500 shadow-md shadow-indigo-500 animate-pulse scale-125'
                      : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={resetChallenge}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Abort
            </button>
          </div>

          {/* Shuffled Dynamic Card Grid */}
          <div
            className={`glass-panel p-6 rounded-3xl border border-gray-800 transition-all duration-300 ${
              shakeGrid ? 'animate-shake border-red-500' : ''
            }`}
          >
            <motion.div
              layout
              className={`grid gap-3 sm:gap-4 ${
                gridSize === 9 ? 'grid-cols-3' : 'grid-cols-4'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {session.gridImages.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onClick={() => handleImageClick(image.id)}
                    className="group aspect-square rounded-2xl border border-gray-800/80 bg-gray-900/60 relative overflow-hidden cursor-pointer shadow-lg hover:border-indigo-500 hover:shadow-indigo-500/20 hover:scale-[1.03] active:scale-95 transition-all duration-200"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity"></div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {statusState === 'SUCCESS' && (
        <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 text-center space-y-6 max-w-lg mx-auto animate-fadeIn glow-success">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 mb-2">
              <Award className="w-3.5 h-3.5" /> Authentication Verified
            </span>
            <h3 className="text-3xl font-extrabold text-white">Login Successful!</h3>
            <p className="text-gray-300 text-sm mt-2">{message}</p>
          </div>
          <button
            onClick={resetChallenge}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            Authenticate Another User
          </button>
        </div>
      )}

      {/* Failure Modal */}
      {statusState === 'FAILED' && (
        <div className="glass-panel p-10 rounded-3xl border border-red-500/30 text-center space-y-6 max-w-lg mx-auto animate-fadeIn glow-danger">
          <div className="w-20 h-20 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
            <XCircle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white">Authentication Failed</h3>
            <p className="text-red-300 text-sm mt-2 font-medium">{message}</p>
          </div>
          <button
            onClick={resetChallenge}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
