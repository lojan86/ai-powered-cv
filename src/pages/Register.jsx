import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Mail, Lock, User, Eye, EyeOff, FileText, ArrowRight, Building } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'candidate', company: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      ...(form.role === 'recruiter' ? { company: form.company } : {}),
    });

    if (result.success) {
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>
      <div className="auth-container animate-fade-in-up">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <FileText size={24} />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Start building your dynamic resume today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${form.role === 'candidate' ? 'active' : ''}`}
                onClick={() => update('role', 'candidate')}
              >
                <User size={18} />
                <span>Candidate</span>
              </button>
              <button
                type="button"
                className={`role-btn ${form.role === 'recruiter' ? 'active' : ''}`}
                onClick={() => update('role', 'recruiter')}
              >
                <Building size={18} />
                <span>Recruiter</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input type="text" className="form-input" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>
            </div>

            {form.role === 'recruiter' && (
              <div className="form-group">
                <label className="form-label">Company</label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <input type="text" className="form-input" placeholder="Company name" value={form.company} onChange={(e) => update('company', e.target.value)} required />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} required />
                <button type="button" className="input-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input type="password" className="form-input" placeholder="Confirm your password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <span className="btn-loader" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
