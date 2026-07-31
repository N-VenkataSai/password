import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Users, Image as ImageIcon, X } from 'lucide-react';

export default function Admin({ API_BASE, backendConnected, registeredUsers, images, setImages, fetchUsers, fetchImages }) {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImage, setNewImage] = useState({ name: '', url: '', category: 'Nature' });
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchImages();
  }, []);

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage.name.trim() || !newImage.url.trim()) {
      setStatusMsg('Please provide both image title and URL.');
      return;
    }

    setActionLoading(true);
    setStatusMsg('');

    if (backendConnected) {
      try {
        const res = await fetch(`${API_BASE}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImage)
        });

        if (res.ok) {
          setShowAddModal(false);
          setNewImage({ name: '', url: '', category: 'Nature' });
          fetchImages();
        } else {
          setStatusMsg('Failed to add new image.');
        }
      } catch (err) {
        setStatusMsg('Error connecting to backend.');
      } finally {
        setActionLoading(false);
      }
    } else {
      const addedImg = {
        id: Date.now(),
        name: newImage.name.trim(),
        url: newImage.url.trim(),
        category: newImage.category
      };
      setImages(prev => [...prev, addedImg]);
      setShowAddModal(false);
      setNewImage({ name: '', url: '', category: 'Nature' });
      setActionLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to remove this image from the library?')) return;

    if (backendConnected) {
      try {
        const res = await fetch(`${API_BASE}/images/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchImages();
        } else {
          alert('Failed to delete image.');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Database className="w-3.5 h-3.5" /> Administration & Management
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage registered accounts, inspect graphical password sequence lengths, and edit the image repository.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Image
          </button>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Registered Users ({registeredUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'images'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Image Repository ({images.length})
          </button>
        </div>
      </div>

      {/* Tab Content 1: Users */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900/90 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4">Sequence Length</th>
                  <th className="px-6 py-4">Sequence Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {registeredUsers.length > 0 ? (
                  registeredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">#{u.id}</td>
                      <td className="px-6 py-4 font-bold text-white">{u.username}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {u.passwordSequence?.length || 5} Images
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {u.passwordSequence && u.passwordSequence.map((seq, idx) => (
                            <img
                              key={idx}
                              src={seq.imageItem?.url}
                              alt={seq.imageItem?.name}
                              className="w-7 h-7 rounded-lg object-cover border border-gray-700"
                              title={`${idx + 1}: ${seq.imageItem?.name}`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                      No registered users found. Click "Register" tab to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Image Repository */}
      {activeTab === 'images' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group glass-panel rounded-2xl border border-gray-800 overflow-hidden relative">
              <img src={img.url} alt={img.name} className="w-full aspect-square object-cover" />
              <div className="p-3 bg-gray-900/90">
                <p className="text-xs font-bold text-white truncate">{img.name}</p>
                <span className="text-[10px] text-indigo-400 font-semibold">{img.category}</span>
              </div>
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-2 right-2 p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Remove Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Image */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Image to Library</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Image Name</label>
                <input
                  type="text"
                  value={newImage.name}
                  onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
                  placeholder="e.g. Space Galaxy"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="Nature">Nature</option>
                  <option value="Animals">Animals</option>
                  <option value="Tech">Tech</option>
                  <option value="Food">Food</option>
                  <option value="Objects">Objects</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>

              {statusMsg && <p className="text-xs text-amber-400 font-semibold">{statusMsg}</p>}

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
              >
                {actionLoading ? 'Saving...' : 'Add Image'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
