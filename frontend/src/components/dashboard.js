/* dashboard.js */

// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to LJ Shop Dashboard</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <div className="profile-card">
          <h2>Your Profile</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {profile && (
            <div className="profile-info">
              <div className="profile-item">
                <strong>Username:</strong> {profile.user.username}
              </div>
              <div className="profile-item">
                <strong>Email:</strong> {profile.user.email || 'Not provided'}
              </div>
              <div className="profile-item">
                <strong>First Name:</strong> {profile.user.first_name || 'Not provided'}
              </div>
              <div className="profile-item">
                <strong>Last Name:</strong> {profile.user.last_name || 'Not provided'}
              </div>
              <div className="profile-item">
                <strong>Bio:</strong> {profile.bio || 'No bio yet'}
              </div>
              <div className="profile-item">
                <strong>Location:</strong> {profile.location || 'Not specified'}
              </div>
              <div className="profile-item">
                <strong>Member since:</strong> {new Date(profile.user.date_joined).toLocaleDateString()}
              </div>
            </div>
          )}
          
          <div className="profile-actions">
            <button className="edit-profile-button">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Shop Stats</h3>
            <p>Welcome to your LJ Shop dashboard. More features coming soon!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;