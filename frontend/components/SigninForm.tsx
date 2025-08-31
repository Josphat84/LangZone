//frontend/components/SigninForm.tsx
//Signing in logic

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) setError(error.message);
    else {
      // user logged in successfully
      alert('Signed in successfully!');
      // Optionally, close modal or redirect
    }
  };

  return (
    <form onSubmit={handleSignin} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />

      <button
        type="submit"
        className="bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
