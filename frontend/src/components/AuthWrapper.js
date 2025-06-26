/* AuthWrapper.js */

// src/components/AuthWrapper.js - Separate authentication wrapper
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './dashboard';
import { authAPI } from '../services/api';
import './AuthWrapper.css';

function AuthWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default AuthWrapper;