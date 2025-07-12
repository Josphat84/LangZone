//hooks.js

// src/hooks.js
import { useState } from 'react';

const defaultAvatar = 'https://via.placeholder.com/150';

export const useSafeUser = (initialUser = null) => {
  const [user, setUser] = useState(initialUser || {
    name: 'Guest',
    email: '',
    picture: defaultAvatar,
    userMf: null // Explicitly initialize this property
  });

  const safeSetUser = (userData) => {
    if (!userData) {
      setUser({
        name: 'Guest',
        email: '',
        picture: defaultAvatar,
        userMf: null
      });
      return;
    }

    setUser({
      name: userData.name || 'Guest',
      email: userData.email || '',
      picture: userData.picture || defaultAvatar,
      userMf: userData.userMf || null // Safe access
    });
  };

  return [user, safeSetUser];
};