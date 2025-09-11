//frontend/components/authButtons.tsx
//login and signup logic



'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Combined Auth Component for Header
export function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Check auth state on mount
  useState(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-teal-200 rounded-full px-4 py-2 shadow-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-teal-800 hidden sm:inline">
            Hi, {user.email?.split('@')[0]}
          </span>
        </div>
        <Button
          onClick={handleSignOut}
          variant="destructive"
          size="sm"
          className="shadow-md"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignupDialog isOpen={isSignupOpen} setIsOpen={setIsSignupOpen} setIsLoginOpen={setIsLoginOpen} />
      <LoginDialog isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} setIsSignupOpen={setIsSignupOpen} />
    </div>
  );
}

// Signup Component
function SignupDialog({ isOpen, setIsOpen, setIsLoginOpen }: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void;
  setIsLoginOpen: (open: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setMessage('Check your email for the confirmation link!');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur border-teal-600 text-teal-700 hover:bg-white shadow-md">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create an account
          </DialogTitle>
          <DialogDescription className="text-center">
            Join our community of language learners
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('error') 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}>
              {message}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </Button>
        </form>
        
        <Separator className="my-4" />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              className="text-teal-600 hover:text-teal-700 font-medium"
              onClick={switchToLogin}
            >
              Sign In
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Login Component
function LoginDialog({ isOpen, setIsOpen, setIsSignupOpen }: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void;
  setIsSignupOpen: (open: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setIsOpen(false); // Close modal on successful sign in
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsOpen(false);
    setIsSignupOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-md">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Sign In
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome back! Please sign in to continue
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('error') 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}>
              {message}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </Button>
        </form>
        
        <Separator className="my-4" />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-teal-600 hover:text-teal-700 font-medium"
              onClick={switchToSignup}
            >
              Sign Up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}