import { useParams, useSearchParams } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { useEffect, useRef } from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink,
  Download, Calendar, Award, Star, Briefcase, GraduationCap,
  Code, Languages
} from 'lucide-react';
import './ResumeView.css';

export default function ResumeView() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { getResumeBySlug } = useResume();
  const resume = getResumeBySlug(slug);
  const resumeRef = useRef(null);

  useEffect(() => {
    if (searchParams.get('download') === 'true' && resume) {
      setTimeout(async () => {
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          html2pdf()
            .set({
              margin: [10, 10],
              filename: `${resume.personalInfo.fullName || 'resume'}.pdf`,
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            })
            .from(resumeRef.current)
            .save();
        } catch (err) {
          console.error('PDF generation error:', err);
        }
      }, 1000);
    }
  }, [searchParams, resume]);

  if (!resume) {
    return (
      <div className="resume-not-found">
        <h1>Resume Not Found</h1>
        <p>This resume link may be invalid or the resume has been removed.</p>
      </div>
    );
  }

  const pi = resume.personalInfo;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const handleDownload = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf()
        .set({
          margin: [10, 10],
          filename: `${pi.fullName || 'resume'}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(resumeRef.current)
        .save();
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  const skillsByCategory = resume.skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="resume-view-page">
      <div className="resume-view-actions">
        <button className="btn btn-primary btn-sm" onClick={handleDownload}>
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="resume-view-container" ref={resumeRef}>
        {/* Header */}
        <header className="rv-header">
          <div className="rv-header-main">
            <h1 className="rv-name">{pi.fullName}</h1>
            {pi.title && <p className="rv-title">{pi.title}</p>}
          </div>
          <div className="rv-contact-grid">
            {pi.email && <a href={`mailto:${pi.email}`} className="rv-contact-item"><Mail size={14} /> {pi.email}</a>}
            {pi.phone && <a href={`tel:${pi.phone}`} className="rv-contact-item"><Phone size={14} /> {pi.phone}</a>}
            {pi.location && <span className="rv-contact-item"><MapPin size={14} /> {pi.location}</span>}
            {pi.website && <a href={pi.website} target="_blank" rel="noopener" className="rv-contact-item"><Globe size={14} /> Portfolio</a>}
            {pi.linkedin && <a href={`https://${pi.linkedin}`} target="_blank" rel="noopener" className="rv-contact-item"><Linkedin size={14} /> LinkedIn</a>}
            {pi.github && <a href={`https://${pi.github}`} target="_blank" rel="noopener" className="rv-contact-item"><Github size={14} /> GitHub</a>}
          </div>
        </header>

        {/* Summary */}
        {pi.summary && (
          <section className="rv-section">
            <p className="rv-summary">{pi.summary}</p>
          </section>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><Star size={18} /> Skills</h2>
            <div className="rv-skills-categories">
              {Object.entries(skillsByCategory).map(([cat, skills]) => (
                <div key={cat} className="rv-skill-category">
                  <span className="rv-skill-cat-label">{cat}:</span>
                  <div className="rv-skill-tags">
                    {skills.map(skill => (
                      <span key={skill.id} className="rv-skill-tag">
                        {skill.name}
                        {skill.level && <span className="rv-skill-level">({skill.level})</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><Briefcase size={18} /> Experience</h2>
            {resume.experience.map(exp => (
              <div key={exp.id} className="rv-exp-item">
                <div className="rv-exp-header">
                  <div>
                    <h3 className="rv-exp-position">{exp.position}</h3>
                    <p className="rv-exp-company">{exp.company} {exp.location && `· ${exp.location}`}</p>
                  </div>
                  <span className="rv-exp-date">
                    <Calendar size={13} /> {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="rv-exp-desc">{exp.description}</p>}
                {exp.highlights?.length > 0 && (
                  <ul className="rv-highlights">
                    {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><GraduationCap size={18} /> Education</h2>
            {resume.education.map(edu => (
              <div key={edu.id} className="rv-exp-item">
                <div className="rv-exp-header">
                  <div>
                    <h3 className="rv-exp-position">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="rv-exp-company">{edu.institution} {edu.gpa && `· GPA: ${edu.gpa}`}</p>
                  </div>
                  <span className="rv-exp-date">
                    <Calendar size={13} /> {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.highlights?.length > 0 && (
                  <ul className="rv-highlights">
                    {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><Code size={18} /> Projects</h2>
            {resume.projects.map(proj => (
              <div key={proj.id} className="rv-exp-item">
                <div className="rv-exp-header">
                  <div>
                    <h3 className="rv-exp-position">
                      {proj.name}
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener" className="rv-link-icon">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </h3>
                    {proj.technologies?.length > 0 && (
                      <div className="rv-tech-tags">
                        {proj.technologies.map((t, i) => <span key={i} className="rv-tech-tag">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
                {proj.description && <p className="rv-exp-desc">{proj.description}</p>}
                {proj.highlights?.length > 0 && (
                  <ul className="rv-highlights">
                    {proj.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><Award size={18} /> Certifications</h2>
            <div className="rv-certs-grid">
              {resume.certifications.map(cert => (
                <div key={cert.id} className="rv-cert-item">
                  <h4>{cert.name}</h4>
                  <p>{cert.issuer}</p>
                  <span className="rv-cert-date">{formatDate(cert.date)}{cert.expiry && ` — ${formatDate(cert.expiry)}`}</span>
                  {cert.credentialId && <span className="rv-cert-id">ID: {cert.credentialId}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {resume.languages?.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><Languages size={18} /> Languages</h2>
            <div className="rv-lang-grid">
              {resume.languages.map(lang => (
                <div key={lang.id} className="rv-lang-item">
                  <span className="rv-lang-name">{lang.name}</span>
                  <span className="rv-lang-prof">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {resume.achievements?.length > 0 && (
          <section className="rv-section">
            <h2 className="rv-section-title"><Award size={18} /> Achievements</h2>
            <ul className="rv-highlights">
              {resume.achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>
        )}

        {/* Footer */}
        <footer className="rv-footer">
          <p>Last updated: {new Date(resume.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="rv-powered">Powered by ResumeAI</p>
        </footer>
      </div>
    </div>
  );
}
