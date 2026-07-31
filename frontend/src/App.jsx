import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Admin from './components/Admin';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('login'); // login, register, admin
  const [backendConnected, setBackendConnected] = useState(false);
  const [images, setImages] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [registeredUsername, setRegisteredUsername] = useState('');

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
    fetchUsers();
    const interval = setInterval(checkBackendHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegistrationSuccess = (username) => {
    setRegisteredUsername(username);
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
            onRegistrationSuccess={handleRegistrationSuccess}
            images={images}
            fetchImages={fetchImages}
          />
        )}

        {activeTab === 'login' && (
          <Login
            API_BASE={API_BASE}
            initialUsername={registeredUsername}
            registeredUsers={registeredUsers}
            fetchUsers={fetchUsers}
          />
        )}

        {activeTab === 'admin' && (
          <Admin
            API_BASE={API_BASE}
            registeredUsers={registeredUsers}
            images={images}
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
