// src/ErrorBoundary.js


import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (error.message.includes('userMf')) {
      console.log('Clearing problematic user state');
      localStorage.removeItem('user');
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={this.handleReset}>Reset App</button>
        </div>
      );
    }
    return this.props.children;
  }
}