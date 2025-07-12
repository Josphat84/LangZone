import React, { useState, useRef, useEffect, useMemo, Suspense, useCallback } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Assuming your CSS is here
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth
import ErrorBoundary from './ErrorBoundary'; // Assuming you put it in src/ErrorBoundary.js

console.log('React:', React);

// Lazy-loaded components with error handling
// Improved fallback message for lazy-loaded components
const LazyLoadErrorFallback = ({ componentName }) => (
  <div style={{ padding: '20px', textAlign: 'center', color: 'red', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
    <p>Failed to load {componentName}. There might be a network issue or a problem with the component code.</p>
    <p>Please refresh the page.</p>
  </div>
);

const HomePage = React.lazy(() =>
  import('./pages/HomePage').catch(() => ({ default: () => <LazyLoadErrorFallback componentName="Home Page" /> }))
);
const FindTutorsPage = React.lazy(() =>
  import('./pages/FindTutorsPage').catch(() => ({ default: () => <LazyLoadErrorFallback componentName="Find Tutors Page" /> }))
);
const AboutUsPage = React.lazy(() =>
  import('./pages/AboutUsPage').catch(() => ({ default: () => <LazyLoadErrorFallback componentName="About Us Page" /> }))
);
const ContactPage = React.lazy(() =>
  import('./pages/ContactPage').catch(() => ({ default: () => <LazyLoadErrorFallback componentName="Contact Page" /> }))
);



const AppLoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading application...</p>
  </div>
);

// Main App Logic Component (inside BrowserRouter and AuthProvider)
function AppContent() {
  const { user, isAuthenticated, handleLoginSuccess, handleLogout } = useAuth(); // Get user state and auth actions from context

  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    language: 'All',
    onlineOnly: false,
    maxPrice: 100,
  });
  const [apiTutors, setApiTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [tutorsError, setTutorsError] = useState('');

  // Get navigate function - this hook must be called at the top level
  const navigate = useNavigate();

  // Protected API call - Wrapped in useCallback
  const fetchTutors = useCallback(async () => {
    setLoadingTutors(true);
    setTutorsError('');

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.get(`${backendUrl}/api/tutors/`, {
        timeout: 10000,
        headers: {
          'Authorization': user.email ? `Bearer ${user.email}` : '' // Depends on user.email
        }
      });

      setApiTutors(response.data.map(tutor => ({
        id: tutor.id || Math.random().toString(36).substr(2, 9),
        name: tutor.name || 'Tutor',
        avatar: tutor.avatar || 'https://via.placeholder.com/150',
        bio: tutor.bio || 'No bio available',
        languages: tutor.languages || 'Not specified',
        price: tutor.price || 0,
        rating: tutor.rating || 0,
        online: tutor.online || false,
        reviews: tutor.reviews || [],
      })));
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
      setTutorsError(error.response?.data?.message || 'Failed to load tutors');
      // Set some mock data for development/fallback
      setApiTutors([
        {
          id: '1',
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Experienced English tutor with 5 years of experience',
          languages: 'English, Spanish',
          price: 25,
          rating: 4.5,
          online: true,
          reviews: []
        },
        {
          id: '2',
          name: 'Maria Garcia',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Native Spanish speaker, certified teacher',
          languages: 'Spanish, English',
          price: 30,
          rating: 4.8,
          online: false,
          reviews: []
        }
      ]);
    } finally {
      setLoadingTutors(false);
    }
  }, [user.email]); // Dependency for useCallback: fetchTutors needs to re-create if user.email changes

  // Effect for fetching tutors - now depends on fetchTutors (which is stable)
  useEffect(() => {
    if (isAuthenticated) { // Only fetch tutors if authenticated
      fetchTutors();
    } else {
      // Clear tutors if user logs out or is not authenticated
      setApiTutors([]);
      setLoadingTutors(false);
    }
  }, [fetchTutors, isAuthenticated]); // Now correctly depends on fetchTutors (memoized by useCallback) and isAuthenticated


  // Navigation handler
  const handleNavigateToTutors = useCallback(() => {
    navigate('/tutors');
  }, [navigate]); // navigate function is stable, but good practice to include

  // Memoized computations
  const allLanguages = useMemo(() => {
    const langs = new Set();
    apiTutors.forEach(tutor => {
      (tutor.languages?.split(',') || []).forEach(lang =>
        langs.add(lang.trim())
      );
    });
    return ['All', ...Array.from(langs).sort()];
  }, [apiTutors]);

  const filteredTutors = useMemo(() => {
    return apiTutors.filter(tutor => {
      const matchesSearch = !filters.search ||
        [tutor.name, tutor.bio, tutor.languages].join(' ')
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesLanguage = filters.language === 'All' ||
        (tutor.languages || '').toLowerCase()
          .includes(filters.language.toLowerCase());

      return matchesSearch && matchesLanguage &&
        (!filters.onlineOnly || tutor.online) &&
        (Number(tutor.price) <= filters.maxPrice);
    });
  }, [apiTutors, filters]);

  // Protected comment handling
  const handleAddComment = useCallback((tutorId) => {
    if (!newComment.trim() || !user.email) return; // Depends on newComment, user.email

    setComments(prev => ({
      ...prev,
      [tutorId]: [...(prev[tutorId] || []), {
        text: newComment.trim(),
        author: user.name,
        timestamp: new Date().toISOString()
      }]
    }));
    setNewComment('');
  }, [newComment, user.email, user.name]); // Dependencies for handleAddComment

  return (
    <div className="app">
      {!isAuthenticated ? (
        <UnauthenticatedView onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AuthenticatedView
          user={user} // Passed directly from useAuth, no need for prop drilling from AppContent parent
          onLogout={handleLogout} // Passed directly from useAuth
          onNavigateToTutors={handleNavigateToTutors}
          filters={filters}
          setFilters={setFilters}
          allLanguages={allLanguages}
          filteredTutors={filteredTutors}
          loadingTutors={loadingTutors}
          tutorsError={tutorsError}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}

// Main App Component (wrapper for Google OAuth and BrowserRouter)
function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-client-id';

  // State to track if Google script is loaded - moved to App for direct use with GoogleOAuthProvider
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  return (
    <ErrorBoundary> {/* Main ErrorBoundary for the whole app */}
      <GoogleOAuthProvider
        clientId={googleClientId}
        onScriptLoadSuccess={() => {
          console.log('Google script loaded successfully');
          setIsGoogleScriptLoaded(true);
        }}
        onScriptLoadError={(error) => {
          console.error('Google script failed to load:', error);
          // Even if failed, set to true to attempt rendering the login button
          // Or handle more robustly if login is strictly required before any UI
          setIsGoogleScriptLoaded(true);
        }}
      >
        <BrowserRouter>
          <AuthProvider> {/* AuthProvider wraps AppContent to provide auth context */}
            {!isGoogleScriptLoaded ? (
              <AppLoadingFallback />
            ) : (
              <ErrorBoundary> {/* Inner ErrorBoundary for AppContent specifically */}
                <AppContent />
              </ErrorBoundary>
            )}
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

// Subcomponents - modified to use useAuth where appropriate
const UnauthenticatedView = ({ onLoginSuccess }) => (
  <div className="auth-view">
    <header>
      <h1>LangZone Tutors</h1>
      <p>Connect with language experts worldwide</p>
    </header>
    <div className="auth-box">
      <ErrorBoundary> {/* ErrorBoundary for GoogleLogin specifically */}
        <GoogleLogin
          onSuccess={onLoginSuccess}
          onError={(error) => console.log('Login failed:', error)}
          useOneTap={false}
          auto_select={false}
          theme="filled_blue"
          size="large"
        />
      </ErrorBoundary>
    </div>
  </div>
);

// AuthenticatedView now explicitly receives props (or could use more contexts if needed)
const AuthenticatedView = (props) => (
  <>
    <Header
      user={props.user}
      onLogout={props.onLogout}
    />
    <MainContent {...props} /> {/* MainContent receives all other props */}
    <Footer />
  </>
);

// Header and UserProfile use useAuth directly
const Header = () => {
  const { user, handleLogout } = useAuth(); // Directly consume from context
  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo">LangZone</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/tutors">Find Tutors</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <UserProfile user={user} onLogout={handleLogout} /> {/* Still pass to UserProfile for clarity */}
      </div>
    </header>
  );
};

const UserProfile = ({ user, onLogout }) => ( // Still receives props from Header for direct use
  <div className="user-profile">
    <img
      src={user.picture}
      alt={user.name}
      onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
    />
    <div className="user-info">
      <span>Hello, {user.name.split(' ')[0]}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  </div>
);

const MainContent = (props) => (
  <main className="main-content">
    <Suspense fallback={<AppLoadingFallback />}>
      <Routes>
        <Route path="/" element={
          <HomePage onFindTutorsClick={props.onNavigateToTutors} />
        } />
        <Route path="/tutors" element={
          <FindTutorsPage
            tutors={props.filteredTutors}
            loading={props.loadingTutors}
            error={props.tutorsError}
            filters={props.filters}
            onFilterChange={props.setFilters}
            languages={props.allLanguages}
            comments={props.comments}
            newComment={props.newComment}
            onCommentChange={props.setNewComment}
            onAddComment={props.onAddComment}
            currentUser={props.user} // Pass currentUser explicitly if FindTutorsPage needs user details
          />
        } />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Suspense>
  </main>
);

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-content">
      <p>© {new Date().getFullYear()} LangZone Tutors</p>
      <div className="footer-links">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

export default App;