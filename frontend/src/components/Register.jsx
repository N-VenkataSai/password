import React, { useState, useEffect } from 'react';
import { User, CheckCircle, AlertCircle, RefreshCw, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export default function Register({ API_BASE, backendConnected, onRegistrationSuccess, fetchImages, images, registeredUsers, setRegisteredUsers }) {
  const [username, setUsername] = useState('');
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const cats = ['All', ...new Set(images.map(img => img.category))];
      setCategories(cats);
    }
  }, [images]);

  // Check username availability
  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    if (!backendConnected) {
      const exists = registeredUsers.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      setUsernameAvailable(!exists);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/users/check/${encodeURIComponent(username.trim())}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [username, API_BASE, backendConnected, registeredUsers]);

  const handleImageToggle = (image) => {
    const existingIndex = selectedSequence.findIndex(item => item.id === image.id);
    if (existingIndex !== -1) {
      setSelectedSequence(selectedSequence.filter(item => item.id !== image.id));
    } else {
      if (selectedSequence.length >= 5) {
        setErrorMsg('You can select a maximum of 5 images for your password sequence.');
        setTimeout(() => setErrorMsg(''), 3500);
        return;
      }
      setSelectedSequence([...selectedSequence, image]);
    }
  };

  const removeFromSequence = (index) => {
    const updated = [...selectedSequence];
    updated.splice(index, 1);
    setSelectedSequence(updated);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter a username.');
      return;
    }
    if (selectedSequence.length !== 5) {
      setErrorMsg('Please select exactly 5 images to complete your sequence.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    if (backendConnected) {
      try {
        const payload = {
          username: username.trim(),
          imageIds: selectedSequence.map(img => img.id)
        };

        const res = await fetch(`${API_BASE}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          onRegistrationSuccess(username.trim());
        } else {
          setErrorMsg(data.message || 'Registration failed.');
        }
      } catch (err) {
        setErrorMsg('Network error connecting to Spring Boot server.');
      } finally {
        setLoading(false);
      }
    } else {
      // Client-side fallback mode
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          username: username.trim(),
          createdAt: new Date().toISOString(),
          passwordSequence: selectedSequence.map((img, idx) => ({
            sequenceOrder: idx,
            imageItem: img
          }))
        };
        onRegistrationSuccess(newUser);
        setLoading(false);
      }, 400);
    }
  };

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Step 1: User Registration
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2">
            Create Your Graphical Password
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Choose a unique username and select <span className="text-indigo-400 font-semibold">5 images</span> in exact sequence. This order will serve as your visual authentication token.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Registration Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form & Sequence Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" /> Username Account
            </h3>
            
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter desired username..."
                className="w-full bg-gray-900/90 border border-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm font-medium transition-all duration-200 outline-none"
              />
              {username.trim() && usernameAvailable !== null && (
                <div className="absolute right-3 top-3.5 flex items-center gap-1.5 text-xs font-semibold">
                  {usernameAvailable ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Available
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Taken
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sequence Preview Box */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                Selected Sequence ({selectedSequence.length}/5)
              </h3>
              {selectedSequence.length > 0 && (
                <button
                  onClick={() => setSelectedSequence([])}
                  className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Sequence Slots */}
            <div className="grid grid-cols-5 gap-2.5">
              {[0, 1, 2, 3, 4].map((index) => {
                const item = selectedSequence[index];
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 ${
                      item
                        ? 'border-indigo-500/60 bg-gray-900/80 shadow-lg shadow-indigo-500/20'
                        : 'border-dashed border-gray-800 bg-gray-950/40 text-gray-600'
                    }`}
                  >
                    {item ? (
                      <>
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => removeFromSequence(index)}
                          className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading || !username.trim() || selectedSequence.length !== 5 || usernameAvailable === false}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Graphical Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Image Library Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:text-white hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[550px] overflow-y-auto p-1 pr-2">
            {filteredImages.map((image) => {
              const seqIdx = selectedSequence.findIndex(item => item.id === image.id);
              const isSelected = seqIdx !== -1;

              return (
                <div
                  key={image.id}
                  onClick={() => handleImageToggle(image)}
                  className={`group aspect-square rounded-2xl border relative overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-[0.98]'
                      : 'border-gray-800/80 bg-gray-900/40 hover:border-indigo-500/40 hover:scale-[1.02]'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                  
                  <p className="absolute bottom-1.5 left-2 right-2 text-[10px] font-semibold text-gray-200 truncate">
                    {image.name}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 animate-bounce">
                      {seqIdx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
