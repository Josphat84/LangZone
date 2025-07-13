'use client'; // This directive indicates that this is a Client Component

import { useState, useCallback } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // For decoding the ID token
import Link from 'next/link'; // For linking to other pages like sign-up

// Define a type for the decoded Google credential
interface GoogleDecodedCredential {
  iss: string;
  nbf: string;
  aud: string;
  azp: string;
  hd: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailSignIn = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Here you would typically send these credentials to your backend API for authentication
    console.log('Email Sign In Attempt:', { email, password });

    // Simulate API call for demonstration purposes
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password123') {
        setSuccess('Logged in successfully!');
        // In a real app, you would redirect the user or set a session/token
      } else {
        setError('Invalid email or password.');
      }
      // Clear password field for security
      setPassword('');
    }, 1000);
  }, [email, password]);

  const handleGoogleSuccess = useCallback((credentialResponse: CredentialResponse) => {
    setError(null);
    setSuccess(null);

    if (credentialResponse.credential) {
      try {
        const decoded: GoogleDecodedCredential = jwtDecode(credentialResponse.credential);
        console.log('Google Sign In Success:', decoded);
        setSuccess(`Welcome back, ${decoded.given_name}! You've signed in with Google.`);
        // In a real app, you would send this 'decoded' user info (or the raw ID token)
        // to your backend to verify the user and issue a session token.
        // Example: axios.post('/api/auth/google-login', { idToken: credentialResponse.credential });
      } catch (decodeError) {
        console.error("Failed to decode Google credential:", decodeError);
        setError("Failed to process Google sign-in. Please try again.");
      }
    } else {
      setError("Google sign-in failed: No credential found.");
    }
  }, []);

  const handleGoogleError = useCallback(() => {
    console.error('Google Sign In Failed');
    setError("Google sign-in failed. Please try again.");
  }, []);

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClasses = "w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors font-semibold";

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className={labelClasses}>Email</label>
            <input
              type="email"
              id="email"
              className={inputClasses}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClasses}>Password</label>
            <input
              type="password"
              id="password"
              className={inputClasses}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={buttonClasses}>
            Sign In with Email
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign In Button */}
        <div className="mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="360" // Adjust width for smaller screens if needed
            text="signin_with" // 'signin_with', 'signup_with', 'continue_with'
            locale="en"
            shape="rectangular" // 'rectangular' or 'pill'
            theme="filled_blue" // 'outline' or 'filled_blue'
          />
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-teal-600 hover:underline font-semibold">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}