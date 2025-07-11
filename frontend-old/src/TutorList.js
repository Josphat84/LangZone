// File: frontend/src/TutorList.js
// This file is used to fetch and display a list of tutors from the backend API.

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

// Use forwardRef to allow parent components to get a ref to this component
const TutorList = forwardRef((props, ref) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTutors = async () => {
    setLoading(true);
    setError('');
    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL 

      console.log("BASE_URL in use:", BASE_URL);

      const response = await axios.get(`${BASE_URL}/api/tutors/`, {
        withCredentials: true, // Include cookies in the request
      });

      setTutors(response.data);
      console.log('Fetched tutors:', response.data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Failed to load tutors.');
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchTutors method to parent component via ref
  useImperativeHandle(ref, () => ({
    fetchTutors: fetchTutors
  }));

  useEffect(() => {
    fetchTutors();
  }, []);

  // ... (rest of TutorList component rendering logic)
  return (
    <div>
      {loading && <p>Loading tutors...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {tutors.map((tutor) => (
            <li key={tutor.id}>
              {tutor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default TutorList;