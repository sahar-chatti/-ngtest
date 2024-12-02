import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ClientList from './ClientList';
import Login from './Login';
import AppBar from './AppBar';
import BasicTabs from './TabsClients';
import BASE_URL from './constantes';
import axios from 'axios';
import Notification from './components/notification';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const handleLogout = () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem('user');
      window.location.href = '/login';
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      console.log('Checking auth state:', savedUser);

      if (!savedUser && window.location.pathname !== '/login') {
        console.log('No user found, redirecting to login');
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/clients"
            element={
              currentUser ? <ClientList user={currentUser} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/appBar"
            element={
              currentUser ? <AppBar user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />
          <Route path="/" element={currentUser ? <Navigate to="/login" /> : <Login onLogin={handleLogin} />} />
          <Route
            path="/appBar"
            element={
              currentUser ? <BasicTabs user={currentUser} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;