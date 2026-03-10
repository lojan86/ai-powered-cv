import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { useToast } from '../contexts/ToastContext';
import {
  User, Briefcase, GraduationCap, Code, Award, Save,
  Plus, Trash2, ChevronDown, ChevronUp, ExternalLink,
  Eye, ArrowLeft, Globe, Star, Languages
} from 'lucide-react';
import './ResumeBuilder.css';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
  { id: 'skills', label: 'Skills', icon: <Star size={18} /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
  { id: 'projects', label: 'Projects', icon: <Code size={18} /> },
  { id: 'certifications', label: 'Certifications', icon: <Award size={18} /> },
  { id: 'languages', label: 'Languages', icon: <Languages size={18} /> },
];

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getResumeById, updateResume, saveVersion } = useResume();
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState('personal');
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const r = getResumeById(id);
    if (r) setResume({ ...r });
    else navigate('/dashboard');
  }, [id]);

  if (!resume) return null;

  const update = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  const updatePersonal = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleSave = () => {
    setSaving(true);
    updateResume(resume.id, resume);
    setTimeout(() => {
      setSaving(false);
      addToast('Resume saved successfully!', 'success');
    }, 500);
  };

  const handleSaveVersion = () => {
    const label = prompt('Version label (optional):');
    handleSave();
    saveVersion(resume.id, label || '');
    addToast('New version saved!', 'success');
  };

  // ── Array Item Helpers ──
  const addItem = (field, template) => {
    update(field, [...(resume[field] || []), { id: `${field}-${Date.now()}`, ...template }]);
  };

  const removeItem = (field, itemId) => {
    update(field, resume[field].filter(item => item.id !== itemId));
  };

  const updateItem = (field, itemId, key, value) => {
    update(field, resume[field].map(item =>
      item.id === itemId ? { ...item, [key]: value } : item
    ));
  };

  const updateHighlight = (field, itemId, idx, value) => {
    update(field, resume[field].map(item => {
      if (item.id !== itemId) return item;
      const highlights = [...(item.highlights || [])];
      highlights[idx] = value;
      return { ...item, highlights };
    }));
  };

  const addHighlight = (field, itemId) => {
    update(field, resume[field].map(item =>
      item.id === itemId ? { ...item, highlights: [...(item.highlights || []), ''] } : item
    ));
  };

  const removeHighlight = (field, itemId, idx) => {
    update(field, resume[field].map(item => {
      if (item.id !== itemId) return item;
      const highlights = item.highlights.filter((_, i) => i !== idx);
      return { ...item, highlights };
    }));
  };

  return (
    <div className="builder page-enter">
      {/* Top Bar */}
      <div className="builder-topbar">
        <div className="container builder-topbar-inner">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="builder-title-wrap">
            <input
              className="builder-title-input"
              value={resume.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Resume Title"
            />
          </div>
          <div className="builder-topbar-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => window.open(`/r/${resume.slug}`, '_blank')}>
              <Eye size={16} /> Preview
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleSaveVersion}>
              <Save size={16} /> Save Version
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? <span className="btn-loader" /> : <><Save size={16} /> Save</>}
            </button>
          </div>
        </div>
      </div>

      <div className="builder-layout container">
        {/* Sidebar */}
        <aside className="builder-sidebar">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </aside>

        {/* Editor */}
        <div className="builder-editor">
          {activeSection === 'personal' && (
            <PersonalSection data={resume.personalInfo} onChange={updatePersonal} achievements={resume.achievements} onAchievementsChange={(val) => update('achievements', val)} />
          )}
          {activeSection === 'skills' && (
            <SkillsSection skills={resume.skills} onAdd={() => addItem('skills', { name: '', level: 'Intermediate', category: 'General' })} onRemove={(id) => removeItem('skills', id)} onUpdate={(id, key, val) => updateItem('skills', id, key, val)} />
          )}
          {activeSection === 'experience' && (
            <ExperienceSection items={resume.experience} onAdd={() => addItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [] })} onRemove={(id) => removeItem('experience', id)} onUpdate={(id, key, val) => updateItem('experience', id, key, val)} onAddHighlight={(id) => addHighlight('experience', id)} onRemoveHighlight={(id, idx) => removeHighlight('experience', id, idx)} onUpdateHighlight={(id, idx, val) => updateHighlight('experience', id, idx, val)} />
          )}
          {activeSection === 'education' && (
            <EducationSection items={resume.education} onAdd={() => addItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', highlights: [] })} onRemove={(id) => removeItem('education', id)} onUpdate={(id, key, val) => updateItem('education', id, key, val)} onAddHighlight={(id) => addHighlight('education', id)} onRemoveHighlight={(id, idx) => removeHighlight('education', id, idx)} onUpdateHighlight={(id, idx, val) => updateHighlight('education', id, idx, val)} />
          )}
          {activeSection === 'projects' && (
            <ProjectsSection items={resume.projects} onAdd={() => addItem('projects', { name: '', description: '', technologies: [], url: '', highlights: [] })} onRemove={(id) => removeItem('projects', id)} onUpdate={(id, key, val) => updateItem('projects', id, key, val)} onAddHighlight={(id) => addHighlight('projects', id)} onRemoveHighlight={(id, idx) => removeHighlight('projects', id, idx)} onUpdateHighlight={(id, idx, val) => updateHighlight('projects', id, idx, val)} />
          )}
          {activeSection === 'certifications' && (
            <CertificationsSection items={resume.certifications} onAdd={() => addItem('certifications', { name: '', issuer: '', date: '', expiry: '', credentialId: '' })} onRemove={(id) => removeItem('certifications', id)} onUpdate={(id, key, val) => updateItem('certifications', id, key, val)} />
          )}
          {activeSection === 'languages' && (
            <LanguagesSection items={resume.languages} onAdd={() => addItem('languages', { name: '', proficiency: 'Conversational' })} onRemove={(id) => removeItem('languages', id)} onUpdate={(id, key, val) => updateItem('languages', id, key, val)} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section Components ──

function PersonalSection({ data, onChange, achievements, onAchievementsChange }) {
  return (
    <div className="editor-section animate-fade-in">
      <h2 className="editor-section-title"><User size={20} /> Personal Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" value={data.fullName} onChange={(e) => onChange('fullName', e.target.value)} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="form-label">Professional Title</label>
          <input className="form-input" value={data.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Full Stack Developer" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)} placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={data.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={data.location} onChange={(e) => onChange('location', e.target.value)} placeholder="San Francisco, CA" />
        </div>
        <div className="form-group">
          <label className="form-label">Website</label>
          <input className="form-input" value={data.website} onChange={(e) => onChange('website', e.target.value)} placeholder="https://yoursite.com" />
        </div>
        <div className="form-group">
          <label className="form-label">LinkedIn</label>
          <input className="form-input" value={data.linkedin} onChange={(e) => onChange('linkedin', e.target.value)} placeholder="linkedin.com/in/yourprofile" />
        </div>
        <div className="form-group">
          <label className="form-label">GitHub</label>
          <input className="form-input" value={data.github} onChange={(e) => onChange('github', e.target.value)} placeholder="github.com/yourusername" />
        </div>
      </div>
      <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
        <label className="form-label">Professional Summary</label>
        <textarea className="form-input form-textarea" value={data.summary} onChange={(e) => onChange('summary', e.target.value)} placeholder="Write a compelling summary of your professional background..." rows={4} />
      </div>
      <div className="form-group" style={{ marginTop: 'var(--space-6)' }}>
        <label className="form-label">Achievements (one per line)</label>
        <textarea
          className="form-input form-textarea"
          value={(achievements || []).join('\n')}
          onChange={(e) => onAchievementsChange(e.target.value.split('\n').filter(Boolean))}
          placeholder="Winner, Hackathon 2024&#10;Speaker at Conference 2025&#10;Published articles with 50K+ views"
          rows={4}
        />
      </div>
    </div>
  );
}

function SkillsSection({ skills, onAdd, onRemove, onUpdate }) {
  const categories = ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'Tools', 'Soft Skills', 'General'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="editor-section animate-fade-in">
      <div className="editor-section-header">
        <h2 className="editor-section-title"><Star size={20} /> Skills</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add Skill</button>
      </div>
      {skills.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
          <p className="empty-state-desc">Add your technical and soft skills</p>
          <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add Skill</button>
        </div>
      ) : (
        <div className="skills-editor-grid">
          {skills.map(skill => (
            <div key={skill.id} className="skill-edit-item">
              <input className="form-input" value={skill.name} onChange={(e) => onUpdate(skill.id, 'name', e.target.value)} placeholder="Skill name" />
              <select className="form-input form-select" value={skill.level} onChange={(e) => onUpdate(skill.id, 'level', e.target.value)}>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select className="form-input form-select" value={skill.category} onChange={(e) => onUpdate(skill.id, 'category', e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn-icon-sm danger-icon" onClick={() => onRemove(skill.id)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceSection({ items, onAdd, onRemove, onUpdate, onAddHighlight, onRemoveHighlight, onUpdateHighlight }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="editor-section animate-fade-in">
      <div className="editor-section-header">
        <h2 className="editor-section-title"><Briefcase size={20} /> Work Experience</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add</button>
      </div>
      {items.map(item => (
        <div key={item.id} className="editor-item-card card">
          <div className="item-card-header" onClick={() => toggle(item.id)}>
            <div>
              <h4>{item.position || 'New Position'}</h4>
              <p className="item-card-sub">{item.company || 'Company'} {item.location && `· ${item.location}`}</p>
            </div>
            <div className="item-card-actions">
              <button className="btn-icon-sm danger-icon" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}><Trash2 size={16} /></button>
              {expanded[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          {expanded[item.id] && (
            <div className="item-card-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Position</label><input className="form-input" value={item.position} onChange={(e) => onUpdate(item.id, 'position', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={item.company} onChange={(e) => onUpdate(item.id, 'company', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={item.location} onChange={(e) => onUpdate(item.id, 'location', e.target.value)} /></div>
                <div className="form-group">
                  <label className="form-label">Currently Working</label>
                  <label className="toggle-label">
                    <input type="checkbox" checked={item.current} onChange={(e) => onUpdate(item.id, 'current', e.target.checked)} />
                    <span>{item.current ? 'Yes' : 'No'}</span>
                  </label>
                </div>
                <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="month" value={item.startDate} onChange={(e) => onUpdate(item.id, 'startDate', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">End Date</label><input className="form-input" type="month" value={item.endDate} onChange={(e) => onUpdate(item.id, 'endDate', e.target.value)} disabled={item.current} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} rows={3} /></div>
              <div className="form-group">
                <div className="highlights-header"><label className="form-label">Key Achievements</label><button className="btn btn-secondary btn-sm" onClick={() => onAddHighlight(item.id)}><Plus size={14} /></button></div>
                {(item.highlights || []).map((h, idx) => (
                  <div key={idx} className="highlight-row">
                    <input className="form-input" value={h} onChange={(e) => onUpdateHighlight(item.id, idx, e.target.value)} placeholder="Achievement or responsibility" />
                    <button className="btn-icon-sm danger-icon" onClick={() => onRemoveHighlight(item.id, idx)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ items, onAdd, onRemove, onUpdate, onAddHighlight, onRemoveHighlight, onUpdateHighlight }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="editor-section animate-fade-in">
      <div className="editor-section-header">
        <h2 className="editor-section-title"><GraduationCap size={20} /> Education</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add</button>
      </div>
      {items.map(item => (
        <div key={item.id} className="editor-item-card card">
          <div className="item-card-header" onClick={() => toggle(item.id)}>
            <div>
              <h4>{item.degree || 'New Degree'} {item.field && `in ${item.field}`}</h4>
              <p className="item-card-sub">{item.institution || 'Institution'}</p>
            </div>
            <div className="item-card-actions">
              <button className="btn-icon-sm danger-icon" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}><Trash2 size={16} /></button>
              {expanded[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          {expanded[item.id] && (
            <div className="item-card-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Institution</label><input className="form-input" value={item.institution} onChange={(e) => onUpdate(item.id, 'institution', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Degree</label><input className="form-input" value={item.degree} onChange={(e) => onUpdate(item.id, 'degree', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Field of Study</label><input className="form-input" value={item.field} onChange={(e) => onUpdate(item.id, 'field', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">GPA</label><input className="form-input" value={item.gpa} onChange={(e) => onUpdate(item.id, 'gpa', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="month" value={item.startDate} onChange={(e) => onUpdate(item.id, 'startDate', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">End Date</label><input className="form-input" type="month" value={item.endDate} onChange={(e) => onUpdate(item.id, 'endDate', e.target.value)} /></div>
              </div>
              <div className="form-group">
                <div className="highlights-header"><label className="form-label">Highlights</label><button className="btn btn-secondary btn-sm" onClick={() => onAddHighlight(item.id)}><Plus size={14} /></button></div>
                {(item.highlights || []).map((h, idx) => (
                  <div key={idx} className="highlight-row">
                    <input className="form-input" value={h} onChange={(e) => onUpdateHighlight(item.id, idx, e.target.value)} />
                    <button className="btn-icon-sm danger-icon" onClick={() => onRemoveHighlight(item.id, idx)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({ items, onAdd, onRemove, onUpdate, onAddHighlight, onRemoveHighlight, onUpdateHighlight }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const updateTech = (itemId, value) => {
    onUpdate(itemId, 'technologies', value.split(',').map(t => t.trim()).filter(Boolean));
  };

  return (
    <div className="editor-section animate-fade-in">
      <div className="editor-section-header">
        <h2 className="editor-section-title"><Code size={20} /> Projects</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add</button>
      </div>
      {items.map(item => (
        <div key={item.id} className="editor-item-card card">
          <div className="item-card-header" onClick={() => toggle(item.id)}>
            <div>
              <h4>{item.name || 'New Project'}</h4>
              <p className="item-card-sub">{item.technologies?.join(', ') || 'No technologies'}</p>
            </div>
            <div className="item-card-actions">
              <button className="btn-icon-sm danger-icon" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}><Trash2 size={16} /></button>
              {expanded[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          {expanded[item.id] && (
            <div className="item-card-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Project Name</label><input className="form-input" value={item.name} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">URL</label><input className="form-input" value={item.url} onChange={(e) => onUpdate(item.id, 'url', e.target.value)} placeholder="https://..." /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} rows={3} /></div>
              <div className="form-group"><label className="form-label">Technologies (comma-separated)</label><input className="form-input" value={item.technologies?.join(', ') || ''} onChange={(e) => updateTech(item.id, e.target.value)} placeholder="React, Node.js, PostgreSQL" /></div>
              <div className="form-group">
                <div className="highlights-header"><label className="form-label">Highlights</label><button className="btn btn-secondary btn-sm" onClick={() => onAddHighlight(item.id)}><Plus size={14} /></button></div>
                {(item.highlights || []).map((h, idx) => (
                  <div key={idx} className="highlight-row">
                    <input className="form-input" value={h} onChange={(e) => onUpdateHighlight(item.id, idx, e.target.value)} />
                    <button className="btn-icon-sm danger-icon" onClick={() => onRemoveHighlight(item.id, idx)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificationsSection({ items, onAdd, onRemove, onUpdate }) {
  return (
    <div className="editor-section animate-fade-in">
      <div className="editor-section-header">
        <h2 className="editor-section-title"><Award size={20} /> Certifications</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add</button>
      </div>
      {items.map(item => (
        <div key={item.id} className="cert-edit-item card">
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Certification Name</label><input className="form-input" value={item.name} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Issuing Organization</label><input className="form-input" value={item.issuer} onChange={(e) => onUpdate(item.id, 'issuer', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Issue Date</label><input className="form-input" type="month" value={item.date} onChange={(e) => onUpdate(item.id, 'date', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Expiry Date</label><input className="form-input" type="month" value={item.expiry} onChange={(e) => onUpdate(item.id, 'expiry', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Credential ID</label><input className="form-input" value={item.credentialId} onChange={(e) => onUpdate(item.id, 'credentialId', e.target.value)} /></div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => onRemove(item.id)}><Trash2 size={14} /> Remove</button>
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({ items, onAdd, onRemove, onUpdate }) {
  const proficiencies = ['Basic', 'Conversational', 'Professional', 'Fluent', 'Native'];
  return (
    <div className="editor-section animate-fade-in">
      <div className="editor-section-header">
        <h2 className="editor-section-title"><Languages size={20} /> Languages</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={16} /> Add</button>
      </div>
      <div className="skills-editor-grid">
        {items.map(item => (
          <div key={item.id} className="skill-edit-item">
            <input className="form-input" value={item.name} onChange={(e) => onUpdate(item.id, 'name', e.target.value)} placeholder="Language" />
            <select className="form-input form-select" value={item.proficiency} onChange={(e) => onUpdate(item.id, 'proficiency', e.target.value)}>
              {proficiencies.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button className="btn-icon-sm danger-icon" onClick={() => onRemove(item.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
