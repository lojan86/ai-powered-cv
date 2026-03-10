import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeView from './pages/ResumeView';
import AIAnalysis from './pages/AIAnalysis';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ProfileSettings from './pages/ProfileSettings';
import './App.css';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/r/:slug" element={<ResumeView />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'recruiter' ? <RecruiterDashboard /> : <Dashboard />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/edit/:id"
            element={
              <ProtectedRoute roles={['candidate']}>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-analysis/:id"
            element={
              <ProtectedRoute roles={['candidate']}>
                <AIAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
