import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Admin from './components/Admin';
import { DEFAULT_IMAGES } from './data/defaultImages';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('login'); // login, register, admin
  const [backendConnected, setBackendConnected] = useState(false);
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 1,
      username: "demo_user",
      createdAt: new Date().toISOString(),
      passwordSequence: [
        { sequenceOrder: 0, imageItem: DEFAULT_IMAGES[0] },  // Sunset Mountain
        { sequenceOrder: 1, imageItem: DEFAULT_IMAGES[6] },  // Majestic Tiger
        { sequenceOrder: 2, imageItem: DEFAULT_IMAGES[12] }, // Sleek Laptop
        { sequenceOrder: 3, imageItem: DEFAULT_IMAGES[18] }, // Artisanal Pizza
        { sequenceOrder: 4, imageItem: DEFAULT_IMAGES[24] }  // Vintage Camera
      ]
    }
  ]);
  const [registeredUsername, setRegisteredUsername] = useState('demo_user');

  // Check Spring Boot backend health & connection
  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/images`);
      if (res.ok) {
        setBackendConnected(true);
        const data = await res.json();
        setImages(data);
      } else {
        setBackendConnected(false);
      }
    } catch (err) {
      setBackendConnected(false);
    }
  };

  const fetchUsers = async () => {
    if (!backendConnected) return;
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const data = await res.json();
        setRegisteredUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchImages = async () => {
    if (!backendConnected) return;
    try {
      const res = await fetch(`${API_BASE}/images`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (backendConnected) {
      fetchUsers();
      fetchImages();
    }
  }, [backendConnected]);

  const handleRegistrationSuccess = (userObj) => {
    if (typeof userObj === 'string') {
      setRegisteredUsername(userObj);
    } else if (userObj && userObj.username) {
      setRegisteredUsername(userObj.username);
      setRegisteredUsers(prev => [
        ...prev.filter(u => u.username !== userObj.username),
        userObj
      ]);
    }
    fetchUsers();
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendConnected={backendConnected}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-16">
        {activeTab === 'register' && (
          <Register
            API_BASE={API_BASE}
            backendConnected={backendConnected}
            onRegistrationSuccess={handleRegistrationSuccess}
            images={images}
            fetchImages={fetchImages}
            registeredUsers={registeredUsers}
            setRegisteredUsers={setRegisteredUsers}
          />
        )}

        {activeTab === 'login' && (
          <Login
            API_BASE={API_BASE}
            backendConnected={backendConnected}
            initialUsername={registeredUsername}
            registeredUsers={registeredUsers}
            fetchUsers={fetchUsers}
            allImages={images}
          />
        )}

        {activeTab === 'admin' && (
          <Admin
            API_BASE={API_BASE}
            backendConnected={backendConnected}
            registeredUsers={registeredUsers}
            images={images}
            setImages={setImages}
            fetchUsers={fetchUsers}
            fetchImages={fetchImages}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-6 text-center text-xs text-gray-600 font-medium">
        <p>Dynamic Graphical Password Authentication System &bull; Spring Boot + React + Tailwind CSS</p>
      </footer>
    </div>
  );
}
