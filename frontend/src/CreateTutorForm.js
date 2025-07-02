// CreateTutorForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './CreateTutorForm.css';

function CreateTutorForm() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    languages: '',
    age: '', // Added age field that appears in your UI
    price: '',
    online: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting data:', formData); // Debug log
      
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tutors/`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      console.log('Success response:', response.data); // Debug log
      alert('Tutor profile created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        bio: '',
        languages: '',
        age: '',
        price: '',
        online: false,
      });
      
    } catch (error) {
      console.error('Full error object:', error); // Debug log
      
      let errorMessage = 'Failed to create profile. ';
      
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        errorMessage += `Server error: ${error.response.status}`;
        if (error.response.data?.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
      } else if (error.request) {
        // Request made but no response received
        console.error('No response received:', error.request);
        errorMessage += 'No response from server. Check if backend is running.';
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tutor-form">
      <h2>Create Tutor Profile</h2>
      
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      
      <input 
        name="name" 
        placeholder="Name" 
        value={formData.name}
        onChange={handleChange} 
        required 
      />
      
      <textarea 
        name="bio" 
        placeholder="Bio" 
        value={formData.bio}
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="languages" 
        placeholder="Languages (e.g. English, Shona)" 
        value={formData.languages}
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="age" 
        type="number" 
        placeholder="Age" 
        value={formData.age}
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="price" 
        type="number" 
        step="0.01"
        placeholder="Price per hour" 
        value={formData.price}
        onChange={handleChange} 
        required 
      />
      
      <label>
        <input 
          name="online" 
          type="checkbox" 
          checked={formData.online}
          onChange={handleChange} 
        />
        Online Now?
      </label>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Submit'}
      </button>
    </form>
  );
}

export default CreateTutorForm;