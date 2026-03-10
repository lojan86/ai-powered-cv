import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';
import {
  Search, Users, ExternalLink, Star, Filter, Eye, Bookmark,
  BookmarkCheck, MapPin, Mail, Briefcase
} from 'lucide-react';
import './RecruiterDashboard.css';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { getAllPublicResumes } = useResume();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_bookmarks') || '[]'); } catch { return []; }
  });
  const [showBookmarked, setShowBookmarked] = useState(false);

  const publicResumes = getAllPublicResumes();

  // Get all unique skills for filter
  const allSkills = useMemo(() => {
    const skills = new Set();
    publicResumes.forEach(r => r.skills.forEach(s => skills.add(s.name)));
    return [...skills].sort();
  }, [publicResumes]);

  const filteredResumes = useMemo(() => {
    let filtered = publicResumes;

    if (showBookmarked) {
      filtered = filtered.filter(r => bookmarks.includes(r.id));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.personalInfo.fullName?.toLowerCase().includes(term) ||
        r.personalInfo.title?.toLowerCase().includes(term) ||
        r.personalInfo.summary?.toLowerCase().includes(term) ||
        r.skills.some(s => s.name.toLowerCase().includes(term))
      );
    }

    if (filterSkill) {
      filtered = filtered.filter(r =>
        r.skills.some(s => s.name.toLowerCase() === filterSkill.toLowerCase())
      );
    }

    return filtered;
  }, [publicResumes, searchTerm, filterSkill, showBookmarked, bookmarks]);

  const toggleBookmark = (resumeId) => {
    const updated = bookmarks.includes(resumeId)
      ? bookmarks.filter(id => id !== resumeId)
      : [...bookmarks, resumeId];
    setBookmarks(updated);
    localStorage.setItem('cv_bookmarks', JSON.stringify(updated));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="recruiter-page page-enter">
      <div className="container">
        <div className="rec-header">
          <div>
            <h1 className="rec-title">
              Recruiter <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="rec-subtitle">
              Welcome, {user?.name}. Search and discover top candidates.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="rec-stats">
          <div className="rec-stat card-gradient">
            <Users size={20} />
            <div>
              <div className="stat-number">{publicResumes.length}</div>
              <div className="stat-text">Candidates</div>
            </div>
          </div>
          <div className="rec-stat card-gradient">
            <Bookmark size={20} />
            <div>
              <div className="stat-number">{bookmarks.length}</div>
              <div className="stat-text">Bookmarked</div>
            </div>
          </div>
          <div className="rec-stat card-gradient">
            <Star size={20} />
            <div>
              <div className="stat-number">{allSkills.length}</div>
              <div className="stat-text">Unique Skills</div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="rec-filters card">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              className="form-input search-input"
              placeholder="Search by name, title, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-row">
            <div className="filter-select-wrap">
              <Filter size={14} />
              <select className="form-input form-select" value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}>
                <option value="">All Skills</option>
                {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              className={`btn btn-sm ${showBookmarked ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowBookmarked(!showBookmarked)}
            >
              <BookmarkCheck size={16} /> {showBookmarked ? 'Show All' : 'Bookmarked'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rec-results">
          <p className="results-count">{filteredResumes.length} candidate(s) found</p>
          {filteredResumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Search size={32} /></div>
              <h3 className="empty-state-title">No candidates found</h3>
              <p className="empty-state-desc">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="candidate-grid">
              {filteredResumes.map(resume => (
                <div key={resume.id} className="candidate-card card">
                  <div className="candidate-header">
                    <div className="candidate-avatar">
                      {resume.personalInfo.fullName?.charAt(0) || '?'}
                    </div>
                    <button
                      className={`bookmark-btn ${bookmarks.includes(resume.id) ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(resume.id)}
                    >
                      {bookmarks.includes(resume.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>
                  <h3 className="candidate-name">{resume.personalInfo.fullName || 'Anonymous'}</h3>
                  <p className="candidate-title">{resume.personalInfo.title || 'No title'}</p>
                  
                  {resume.personalInfo.location && (
                    <p className="candidate-location"><MapPin size={13} /> {resume.personalInfo.location}</p>
                  )}

                  {resume.personalInfo.summary && (
                    <p className="candidate-summary">
                      {resume.personalInfo.summary.substring(0, 120)}...
                    </p>
                  )}

                  <div className="candidate-skills">
                    {resume.skills.slice(0, 5).map(s => (
                      <span key={s.id} className="badge badge-primary">{s.name}</span>
                    ))}
                    {resume.skills.length > 5 && (
                      <span className="badge badge-primary">+{resume.skills.length - 5}</span>
                    )}
                  </div>

                  <div className="candidate-meta">
                    <span className="candidate-exp">
                      <Briefcase size={13} /> {resume.experience.length} experience(s)
                    </span>
                    <span className="candidate-updated">
                      Updated {formatDate(resume.updatedAt)}
                    </span>
                  </div>

                  <div className="candidate-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => window.open(`/r/${resume.slug}`, '_blank')}>
                      <Eye size={14} /> View Resume
                    </button>
                    {resume.personalInfo.email && (
                      <a href={`mailto:${resume.personalInfo.email}`} className="btn btn-secondary btn-sm">
                        <Mail size={14} /> Contact
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
