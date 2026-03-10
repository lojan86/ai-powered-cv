import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText, LogOut, User, Settings, LayoutDashboard, Menu, X,
  Sparkles, ChevronDown
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const isPublicResume = location.pathname.startsWith('/r/');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <FileText size={22} />
          </div>
          <span className="brand-text">
            Resume<span className="brand-ai">AI</span>
          </span>
        </Link>

        {!isPublicResume && (
          <>
            <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
              {!user ? (
                <>
                  <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)}>Features</a>
                  <a href="#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
                  <a href="#testimonials" className="nav-link" onClick={() => setMobileOpen(false)}>Testimonials</a>
                  <div className="nav-auth-mobile">
                    <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Log In</Link>
                    <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  {user.role === 'candidate' && (
                    <Link to="/dashboard" className={`nav-link ${location.pathname.includes('/ai-analysis') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                      <Sparkles size={16} /> AI Tools
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="navbar-actions">
              {!user ? (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </div>
              ) : (
                <div className="profile-menu">
                  <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
                    <div className="avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="profile-name">{user.name}</span>
                    <ChevronDown size={14} className={profileOpen ? 'rotated' : ''} />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="profile-backdrop" onClick={() => setProfileOpen(false)} />
                      <div className="profile-dropdown">
                        <div className="dropdown-header">
                          <div className="avatar avatar-lg">{user.name?.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className="dropdown-name">{user.name}</div>
                            <div className="dropdown-email">{user.email}</div>
                            <span className="badge badge-primary" style={{ marginTop: 4 }}>{user.role}</span>
                          </div>
                        </div>
                        <div className="dropdown-divider" />
                        <Link to="/dashboard" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                          <Settings size={16} /> Settings
                        </Link>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item danger" onClick={handleLogout}>
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
