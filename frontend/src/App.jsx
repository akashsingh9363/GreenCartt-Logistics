import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useData } from './context/DataContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Management from './pages/Management';
import './App.css';

function App() {
  const { user, token } = useData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show login form if not authenticated
  if (!token || !user) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="truck-animation">
            <div className="truck">🚛</div>
            <div className="road"></div>
          </div>
          <h2>Loading GreenCart Logistics...</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/management" element={<Management />} />
          </Routes>
        </main>
      </div>
    
  );
}

export default App;

