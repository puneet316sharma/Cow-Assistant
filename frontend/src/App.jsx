import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegisterCow from './pages/RegisterCow';
import CowProfile from './pages/CowProfile';
import VaccinationManager from './pages/VaccinationManager';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500 text-sm">
        Authenticating...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Farm Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register-cow"
                element={
                  <ProtectedRoute>
                    <RegisterCow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cows/:tagId"
                element={
                  <ProtectedRoute>
                    <CowProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vaccinations"
                element={
                  <ProtectedRoute>
                    <VaccinationManager />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-stone-900 text-stone-400 text-2xs py-4 text-center border-t border-stone-800">
            Cow Assistant Platform &copy; {new Date().getFullYear()} • Powered by Gemini AI
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
