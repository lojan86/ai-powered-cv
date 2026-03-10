import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';
import { useToast } from '../contexts/ToastContext';
import {
  Plus, FileText, ExternalLink, Sparkles, Download, Clock,
  Trash2, Eye, Edit3, Copy, MoreVertical, TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserResumes, createResume, deleteResume } = useResume();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);

  const resumes = getUserResumes();

  const handleCreate = () => {
    const newResume = createResume();
    if (newResume) {
      addToast('New resume created!', 'success');
      navigate(`/resume/edit/${newResume.id}`);
    }
  };

  const handleCopyLink = (slug) => {
    const link = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(link);
    addToast('Resume link copied to clipboard!', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id);
      addToast('Resume deleted', 'info');
    }
    setMenuOpen(null);
  };

  const handleDownload = async (resume) => {
    addToast('Preparing PDF download...', 'info');
    // Open the resume in a new context for PDF generation
    window.open(`/r/${resume.slug}?download=true`, '_blank');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getCompletionScore = (resume) => {
    let score = 0;
    if (resume.personalInfo.fullName) score += 15;
    if (resume.personalInfo.summary) score += 15;
    if (resume.skills.length > 0) score += 20;
    if (resume.experience.length > 0) score += 25;
    if (resume.education.length > 0) score += 10;
    if (resume.projects.length > 0) score += 15;
    return score;
  };

  return (
    <div className="dashboard page-enter">
      <div className="container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="dash-subtitle">Manage your dynamic resumes and track performance</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={18} /> New Resume
          </button>
        </div>

        {/* Quick Stats */}
        <div className="dash-stats">
          <div className="dash-stat-card card-gradient">
            <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className="stat-number">{resumes.length}</div>
              <div className="stat-text">Resumes</div>
            </div>
          </div>
          <div className="dash-stat-card card-gradient">
            <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
              <Eye size={20} />
            </div>
            <div>
              <div className="stat-number">{resumes.filter(r => r.isPublic).length}</div>
              <div className="stat-text">Public</div>
            </div>
          </div>
          <div className="dash-stat-card card-gradient">
            <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #22c55e, #0ea5e9)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="stat-number">{resumes.reduce((sum, r) => sum + (r.versions?.length || 0), 0)}</div>
              <div className="stat-text">Versions</div>
            </div>
          </div>
          <div className="dash-stat-card card-gradient">
            <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div className="stat-number">AI</div>
              <div className="stat-text">Analysis</div>
            </div>
          </div>
        </div>

        {/* Resume List */}
        <div className="dash-section">
          <h2 className="dash-section-title">Your Resumes</h2>
          {resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={32} />
              </div>
              <h3 className="empty-state-title">No resumes yet</h3>
              <p className="empty-state-desc">Create your first dynamic resume and start sharing it with recruiters.</p>
              <button className="btn btn-primary" onClick={handleCreate}>
                <Plus size={18} /> Create Resume
              </button>
            </div>
          ) : (
            <div className="resume-grid">
              {resumes.map(resume => {
                const completion = getCompletionScore(resume);
                return (
                  <div key={resume.id} className="resume-card card">
                    <div className="resume-card-header">
                      <div className="resume-card-icon">
                        <FileText size={20} />
                      </div>
                      <div className="resume-card-menu">
                        <button className="btn-icon-sm" onClick={() => setMenuOpen(menuOpen === resume.id ? null : resume.id)}>
                          <MoreVertical size={16} />
                        </button>
                        {menuOpen === resume.id && (
                          <>
                            <div className="menu-backdrop" onClick={() => setMenuOpen(null)} />
                            <div className="context-menu">
                              <button onClick={() => { navigate(`/resume/edit/${resume.id}`); setMenuOpen(null); }}>
                                <Edit3 size={14} /> Edit
                              </button>
                              <button onClick={() => { handleCopyLink(resume.slug); setMenuOpen(null); }}>
                                <Copy size={14} /> Copy Link
                              </button>
                              <button onClick={() => { navigate(`/ai-analysis/${resume.id}`); setMenuOpen(null); }}>
                                <Sparkles size={14} /> AI Analysis
                              </button>
                              <button onClick={() => handleDownload(resume)}>
                                <Download size={14} /> Download PDF
                              </button>
                              <div className="menu-divider" />
                              <button className="danger" onClick={() => handleDelete(resume.id)}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="resume-card-title">{resume.title || 'Untitled Resume'}</h3>
                    <p className="resume-card-name">{resume.personalInfo.fullName || 'No name set'}</p>

                    <div className="resume-card-completion">
                      <div className="completion-header">
                        <span>Completion</span>
                        <span className="completion-pct">{completion}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${completion >= 80 ? 'progress-success' : completion >= 50 ? 'progress-primary' : 'progress-warning'}`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>

                    <div className="resume-card-meta">
                      <span className={`badge ${resume.isPublic ? 'badge-success' : 'badge-warning'}`}>
                        {resume.isPublic ? 'Public' : 'Private'}
                      </span>
                      <span className="meta-date">
                        <Clock size={12} /> {formatDate(resume.updatedAt)}
                      </span>
                    </div>

                    <div className="resume-card-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/resume/edit/${resume.id}`)}>
                        <Edit3 size={14} /> Edit
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => window.open(`/r/${resume.slug}`, '_blank')}>
                        <ExternalLink size={14} /> View
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/ai-analysis/${resume.id}`)}>
                        <Sparkles size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Create New Card */}
              <button className="resume-card create-card" onClick={handleCreate}>
                <div className="create-icon">
                  <Plus size={28} />
                </div>
                <h3>Create New Resume</h3>
                <p>Start from scratch</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
