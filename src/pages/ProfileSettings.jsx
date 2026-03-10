import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { User, Mail, Save, Shield, Bell } from 'lucide-react';
import './ProfileSettings.css';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    updateProfile({ name, email });
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="settings-page page-enter">
      <div className="container settings-container">
        <h1 className="settings-title">
          Profile <span className="gradient-text">Settings</span>
        </h1>

        <div className="settings-grid">
          {/* Profile Card */}
          <div className="settings-card card">
            <div className="settings-card-header">
              <User size={20} />
              <h3>Personal Information</h3>
            </div>
            <div className="settings-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input className="form-input" value={user?.role} disabled style={{ opacity: 0.6 }} />
              </div>
              {user?.company && (
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" value={user.company} disabled style={{ opacity: 0.6 }} />
                </div>
              )}
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="settings-card card">
            <div className="settings-card-header">
              <Shield size={20} />
              <h3>Account</h3>
            </div>
            <div className="settings-info">
              <div className="info-row">
                <span className="info-label">Account ID</span>
                <span className="info-value">{user?.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member since</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type</span>
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Notifications Placeholder */}
          <div className="settings-card card">
            <div className="settings-card-header">
              <Bell size={20} />
              <h3>Notifications</h3>
            </div>
            <div className="settings-info">
              <label className="toggle-setting">
                <input type="checkbox" defaultChecked />
                <span>Email notifications for resume views</span>
              </label>
              <label className="toggle-setting">
                <input type="checkbox" defaultChecked />
                <span>Weekly resume performance report</span>
              </label>
              <label className="toggle-setting">
                <input type="checkbox" />
                <span>Marketing emails</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
