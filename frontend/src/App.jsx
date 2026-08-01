import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Dog,
  Car,
  Laptop,
  Moon,
  Trees,
  Camera,
  Pizza,
  Guitar,
  Watch,
  Plane,
  Coffee,
  Heart,
  Sun,
  Key,
  Shield,
  Bike,
  Rocket,
  Gem,
  Music,
  Lock,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Required sequence: Dog -> Car -> Laptop -> Moon -> Tree
const SEQUENCE = [
  { name: 'Dog', label: 'Dog', icon: Dog, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
  { name: 'Car', label: 'Car', icon: Car, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
  { name: 'Laptop', label: 'Laptop', icon: Laptop, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/30' },
  { name: 'Moon', label: 'Moon', icon: Moon, color: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-500/30' },
  { name: 'Tree', label: 'Tree', icon: Trees, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' }
];

// Pool of decoy items
const DECOYS = [
  { name: 'Camera', icon: Camera, color: 'from-pink-500 to-rose-600' },
  { name: 'Pizza', icon: Pizza, color: 'from-red-500 to-orange-600' },
  { name: 'Guitar', icon: Guitar, color: 'from-amber-600 to-yellow-500' },
  { name: 'Watch', icon: Watch, color: 'from-teal-500 to-emerald-600' },
  { name: 'Plane', icon: Plane, color: 'from-sky-500 to-blue-600' },
  { name: 'Coffee', icon: Coffee, color: 'from-yellow-600 to-amber-700' },
  { name: 'Heart', icon: Heart, color: 'from-rose-500 to-pink-600' },
  { name: 'Sun', icon: Sun, color: 'from-amber-400 to-yellow-500' },
  { name: 'Key', icon: Key, color: 'from-violet-500 to-purple-600' },
  { name: 'Shield', icon: Shield, color: 'from-indigo-500 to-blue-600' },
  { name: 'Bicycle', icon: Bike, color: 'from-green-500 to-emerald-600' },
  { name: 'Rocket', icon: Rocket, color: 'from-orange-500 to-red-600' },
  { name: 'Gem', icon: Gem, color: 'from-fuchsia-500 to-pink-600' },
  { name: 'Music', icon: Music, color: 'from-purple-500 to-indigo-500' }
];

export default function App() {
  const [step, setStep] = useState(0); // 0..4
  const [grid, setGrid] = useState([]);
  const [status, setStatus] = useState('IDLE'); // IDLE, AUTHENTICATING, SUCCESS, FAILED
  const [isShuffling, setIsShuffling] = useState(false);
  const [shakeGrid, setShakeGrid] = useState(false);

  // Sound synthesis helpers using Web Audio API for audio feedback
  const playChime = (freq = 587.33, type = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const playErrorSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // Generate a 3x3 (9 items) grid for step K
  const generateGrid = (targetStep) => {
    const targetItem = SEQUENCE[targetStep];
    
    // Filter out target item name from decoys pool
    const candidateDecoys = DECOYS.filter(d => d.name !== targetItem.name);
    // Shuffle decoys and pick 8 random decoys
    const shuffledDecoys = [...candidateDecoys].sort(() => 0.5 - Math.random());
    const selectedDecoys = shuffledDecoys.slice(0, 8);

    // Merge target + 8 decoys and shuffle
    const combined = [...selectedDecoys, targetItem].map((item, idx) => ({
      ...item,
      uniqueId: `${item.name}-${targetStep}-${idx}-${Math.random()}`
    }));

    return combined.sort(() => 0.5 - Math.random());
  };

  const startAuth = () => {
    setStep(0);
    setStatus('AUTHENTICATING');
    setIsShuffling(false);
    setShakeGrid(false);
    setGrid(generateGrid(0));
  };

  useEffect(() => {
    startAuth();
  }, []);

  const handleCardClick = (clickedItem) => {
    // Disable multiple clicks during shuffle or non-authenticating state
    if (isShuffling || status !== 'AUTHENTICATING') return;

    const currentTarget = SEQUENCE[step];

    if (clickedItem.name === currentTarget.name) {
      // Correct selection!
      playChime(600 + step * 100);

      const nextStep = step + 1;
      if (nextStep >= SEQUENCE.length) {
        // Complete! All 5 items matched
        setStatus('SUCCESS');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        // Advance step & shuffle grid
        setIsShuffling(true);
        setTimeout(() => {
          setStep(nextStep);
          setGrid(generateGrid(nextStep));
          setIsShuffling(false);
        }, 500);
      }
    } else {
      // Incorrect selection!
      playErrorSound();
      setShakeGrid(true);
      setTimeout(() => setShakeGrid(false), 500);
      setStatus('FAILED');
    }
  };

  const currentTarget = SEQUENCE[step] || SEQUENCE[0];
  const CurrentTargetIcon = currentTarget.icon;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Glassmorphism Background Orbs */}
      <div className="fixed top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse"></div>

      {/* Main Container */}
      <div className="w-full max-w-xl space-y-6">
        
        {/* Header Title Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide uppercase shadow-inner">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Dynamic Graphical Authentication
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-gray-100 to-indigo-200 bg-clip-text text-transparent">
            Graphical Password System
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
            Click the required image target in exact sequence. Grid tiles will automatically shuffle and refresh decoys after every selection.
          </p>
        </div>

        {/* Progress & Instruction Bar */}
        {status === 'AUTHENTICATING' && (
          <div className="glass-panel p-5 rounded-3xl border border-gray-800/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Instruction Badge */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentTarget.color} flex items-center justify-center text-white shadow-lg ${currentTarget.shadow}`}>
                <CurrentTargetIcon className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Instruction
                </span>
                <span className="text-xl font-extrabold text-white tracking-wide">
                  Select: <span className="text-indigo-400">{currentTarget.name}</span>
                </span>
              </div>
            </div>

            {/* Stepper Dots & Counter */}
            <div className="flex flex-col items-center sm:items-end gap-1.5">
              <span className="text-xs font-bold text-gray-300">
                Step {step + 1} of {SEQUENCE.length}
              </span>
              <div className="flex items-center gap-2">
                {SEQUENCE.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx < step
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400 scale-110'
                        : idx === step
                        ? 'bg-indigo-500 shadow-md shadow-indigo-500 animate-pulse scale-125'
                        : 'bg-gray-800'
                    }`}
                    title={item.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Grid Card State */}
        {status === 'AUTHENTICATING' && (
          <div
            className={`glass-panel p-6 sm:p-7 rounded-3xl border border-gray-800/80 shadow-2xl transition-all duration-300 ${
              shakeGrid ? 'animate-shake border-red-500/80 shadow-red-500/20' : ''
            }`}
          >
            {/* 3x3 Animated Image Grid */}
            <motion.div
              layout
              className="grid grid-cols-3 gap-3.5 sm:gap-5 relative"
            >
              {/* Pointer-events blocker overlay during shuffle transition */}
              {isShuffling && (
                <div className="absolute inset-0 z-20 bg-gray-950/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/90 border border-gray-800 text-xs font-bold text-indigo-300 shadow-lg">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                    Shuffling Grid...
                  </div>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {grid.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.button
                      key={item.uniqueId}
                      layout
                      initial={{ scale: 0.75, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.75, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      onClick={() => handleCardClick(item)}
                      disabled={isShuffling}
                      className="group aspect-square rounded-2xl border border-gray-800/80 bg-gray-900/60 hover:bg-gray-800/80 p-3 sm:p-4 flex flex-col items-center justify-center gap-2.5 relative overflow-hidden transition-all duration-200 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 active:scale-95 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {/* Gradient Ambient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>

                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.color || 'from-indigo-600 to-purple-600'} p-0.5 shadow-md group-hover:scale-110 transition-transform duration-200 flex items-center justify-center`}>
                        <div className="w-full h-full bg-gray-950/90 rounded-[14px] flex items-center justify-center text-white">
                          <ItemIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-100 group-hover:text-indigo-300 transition-colors" />
                        </div>
                      </div>

                      <span className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-white transition-colors relative z-10">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {status === 'SUCCESS' && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/30 text-center space-y-6 animate-fadeIn shadow-2xl shadow-emerald-500/10">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Authentication Verified
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Authentication Successful
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm max-w-sm mx-auto">
                You have correctly selected all 5 target images in exact sequence (<span className="text-emerald-400 font-semibold">Dog → Car → Laptop → Moon → Tree</span>).
              </p>
            </div>

            <button
              onClick={startAuth}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Test Authentication Again</span>
            </button>
          </div>
        )}

        {/* Failure Modal */}
        {status === 'FAILED' && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-red-500/30 text-center space-y-6 animate-fadeIn shadow-2xl shadow-red-500/10">
            <div className="w-20 h-20 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
              <XCircle className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">
                Authentication Failed
              </h2>
              <p className="text-red-300 text-xs sm:text-sm font-medium max-w-sm mx-auto">
                Incorrect image selected. The sequence process has been reset for security.
              </p>
            </div>

            <button
              onClick={startAuth}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Try Again</span>
            </button>
          </div>
        )}

        {/* Footer Sequence Cheat-Sheet Note for Demo */}
        <div className="text-center text-xs text-gray-500 font-medium pt-2">
          Demo Required Sequence: <span className="text-gray-400 font-semibold">Dog → Car → Laptop → Moon → Tree</span>
        </div>
      </div>
    </div>
  );
}
