import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import {
  analyzeResume, scoreForRole, getJobRecommendations, generateInterviewQuestions
} from '../services/aiService';
import {
  Sparkles, ArrowLeft, BarChart3, Target, MessageSquare, Briefcase,
  CheckCircle, AlertTriangle, Info, AlertCircle, TrendingUp,
  Lightbulb, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import './AIAnalysis.css';

export default function AIAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getResumeById } = useResume();
  const resume = getResumeById(id);

  const [activeTab, setActiveTab] = useState('analysis');
  const [analysis, setAnalysis] = useState(null);
  const [roleScore, setRoleScore] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState({});
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    if (!resume) navigate('/dashboard');
  }, [resume]);

  if (!resume) return null;

  const runAnalysis = async () => {
    setLoading(prev => ({ ...prev, analysis: true }));
    const result = await analyzeResume(resume);
    setAnalysis(result);
    setLoading(prev => ({ ...prev, analysis: false }));
  };

  const runRoleScore = async () => {
    if (!roleInput.trim()) return;
    setLoading(prev => ({ ...prev, role: true }));
    const result = await scoreForRole(resume, roleInput);
    setRoleScore(result);
    setLoading(prev => ({ ...prev, role: false }));
  };

  const runJobRecs = async () => {
    setLoading(prev => ({ ...prev, jobs: true }));
    const result = await getJobRecommendations(resume);
    setJobs(result);
    setLoading(prev => ({ ...prev, jobs: false }));
  };

  const runQuestions = async () => {
    setLoading(prev => ({ ...prev, questions: true }));
    const result = await generateInterviewQuestions(resume);
    setQuestions(result);
    setLoading(prev => ({ ...prev, questions: false }));
  };

  const typeIcons = {
    success: <CheckCircle size={16} />,
    warning: <AlertTriangle size={16} />,
    critical: <AlertCircle size={16} />,
    tip: <Lightbulb size={16} />,
    info: <Info size={16} />,
  };

  const tabs = [
    { id: 'analysis', label: 'Resume Analysis', icon: <BarChart3 size={16} /> },
    { id: 'role', label: 'Role Scoring', icon: <Target size={16} /> },
    { id: 'jobs', label: 'Job Matches', icon: <Briefcase size={16} /> },
    { id: 'interview', label: 'Interview Prep', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="ai-page page-enter">
      <div className="container">
        <div className="ai-header">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="ai-title">
              <Sparkles size={24} /> AI Analysis
            </h1>
            <p className="ai-subtitle">Get AI-powered insights for "{resume.title}"</p>
          </div>
        </div>

        <div className="ai-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="ai-content animate-fade-in">
            {!analysis ? (
              <div className="ai-start-card card-gradient">
                <div className="ai-start-icon">
                  <BarChart3 size={32} />
                </div>
                <h3>Resume Analysis</h3>
                <p>Get a comprehensive analysis of your resume with section-by-section scoring and actionable improvement suggestions.</p>
                <button className="btn btn-primary" onClick={runAnalysis} disabled={loading.analysis}>
                  {loading.analysis ? <><span className="btn-loader" /> Analyzing...</> : <><Sparkles size={18} /> Analyze Resume</>}
                </button>
              </div>
            ) : (
              <div className="analysis-results">
                {/* Overall Score */}
                <div className="score-card card-gradient">
                  <div className="score-circle-lg">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke={analysis.overallScore >= 80 ? '#22c55e' : analysis.overallScore >= 60 ? '#6366f1' : '#f59e0b'}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${analysis.overallScore * 3.27} 327`}
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                      />
                    </svg>
                    <div className="score-circle-text">
                      <span className="score-lg-num">{analysis.overallScore}</span>
                      <span className="score-lg-label">Overall</span>
                    </div>
                  </div>
                  <div className="score-sections">
                    {Object.entries(analysis.sectionScores).map(([key, score]) => (
                      <div key={key} className="score-section-item">
                        <div className="score-section-header">
                          <span className="score-section-name">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="score-section-num">{score}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${score >= 80 ? 'progress-success' : score >= 50 ? 'progress-primary' : 'progress-warning'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <h3 className="suggestions-title"><Lightbulb size={18} /> Improvement Suggestions</h3>
                <div className="suggestions-list">
                  {analysis.suggestions.map((s, i) => (
                    <div key={i} className={`suggestion-item suggestion-${s.type}`}>
                      <div className="suggestion-icon">{typeIcons[s.type]}</div>
                      <div>
                        <span className="suggestion-category">{s.category}</span>
                        <p className="suggestion-msg">{s.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-secondary" onClick={runAnalysis} disabled={loading.analysis} style={{ marginTop: 'var(--space-4)' }}>
                  {loading.analysis ? <><span className="btn-loader" /> Re-analyzing...</> : <><Sparkles size={16} /> Re-analyze</>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Role Scoring Tab */}
        {activeTab === 'role' && (
          <div className="ai-content animate-fade-in">
            <div className="role-input-card card-gradient">
              <h3><Target size={20} /> Score for a Job Role</h3>
              <p>Enter a job title to see how well your resume matches the role requirements.</p>
              <div className="role-input-row">
                <input
                  className="form-input"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  onKeyDown={(e) => e.key === 'Enter' && runRoleScore()}
                />
                <button className="btn btn-primary" onClick={runRoleScore} disabled={loading.role || !roleInput.trim()}>
                  {loading.role ? <span className="btn-loader" /> : <><Target size={16} /> Score</>}
                </button>
              </div>
              <div className="quick-roles">
                {['Frontend Developer', 'Full Stack Developer', 'Backend Developer', 'DevOps Engineer', 'Data Scientist'].map(role => (
                  <button key={role} className="quick-role-btn" onClick={() => { setRoleInput(role); }}>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {roleScore && (
              <div className="role-results">
                <div className="role-score-header card-gradient">
                  <h3>{roleScore.jobTitle}</h3>
                  <div className="role-scores-grid">
                    <div className="role-score-item">
                      <div className="role-score-num" style={{ color: roleScore.overallFit >= 70 ? 'var(--success-400)' : 'var(--warning-400)' }}>{roleScore.overallFit}%</div>
                      <div className="role-score-label">Overall Fit</div>
                    </div>
                    <div className="role-score-item">
                      <div className="role-score-num">{roleScore.skillMatch}%</div>
                      <div className="role-score-label">Skill Match</div>
                    </div>
                    <div className="role-score-item">
                      <div className="role-score-num">{roleScore.experienceMatch}%</div>
                      <div className="role-score-label">Experience Match</div>
                    </div>
                  </div>
                </div>

                {roleScore.matchedKeywords.length > 0 && (
                  <div className="role-keywords card">
                    <h4><CheckCircle size={16} /> Matched Keywords</h4>
                    <div className="keyword-tags">
                      {roleScore.matchedKeywords.map((k, i) => <span key={i} className="badge badge-success">{k}</span>)}
                    </div>
                  </div>
                )}

                {roleScore.missingSkills.length > 0 && (
                  <div className="role-keywords card">
                    <h4><AlertTriangle size={16} /> Skills to Develop</h4>
                    <div className="keyword-tags">
                      {roleScore.missingSkills.map((k, i) => <span key={i} className="badge badge-warning">{k}</span>)}
                    </div>
                  </div>
                )}

                <div className="role-recs card">
                  <h4><Lightbulb size={16} /> Recommendations</h4>
                  <ul>
                    {roleScore.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Matches Tab */}
        {activeTab === 'jobs' && (
          <div className="ai-content animate-fade-in">
            {!jobs ? (
              <div className="ai-start-card card-gradient">
                <div className="ai-start-icon">
                  <Briefcase size={32} />
                </div>
                <h3>AI Job Recommendations</h3>
                <p>Discover job opportunities that match your skills and experience.</p>
                <button className="btn btn-primary" onClick={runJobRecs} disabled={loading.jobs}>
                  {loading.jobs ? <><span className="btn-loader" /> Finding jobs...</> : <><Sparkles size={18} /> Find Matching Jobs</>}
                </button>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job, i) => (
                  <div key={i} className="job-card card">
                    <div className="job-match-badge">
                      <TrendingUp size={14} /> {job.matchScore}% match
                    </div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.company} · {job.location}</p>
                    <p className="job-salary">{job.salary}</p>
                    <div className="job-skill-tags">
                      {job.skills.map((s, j) => <span key={j} className="badge badge-primary">{s}</span>)}
                    </div>
                    <span className="badge badge-success">{job.type}</span>
                  </div>
                ))}
                <button className="btn btn-secondary" onClick={runJobRecs} disabled={loading.jobs} style={{ gridColumn: '1 / -1' }}>
                  {loading.jobs ? <span className="btn-loader" /> : <><Sparkles size={16} /> Refresh Recommendations</>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interview Prep Tab */}
        {activeTab === 'interview' && (
          <div className="ai-content animate-fade-in">
            {!questions ? (
              <div className="ai-start-card card-gradient">
                <div className="ai-start-icon">
                  <MessageSquare size={32} />
                </div>
                <h3>AI Interview Preparation</h3>
                <p>Generate personalized interview questions based on your resume, skills, and experience.</p>
                <button className="btn btn-primary" onClick={runQuestions} disabled={loading.questions}>
                  {loading.questions ? <><span className="btn-loader" /> Generating...</> : <><Sparkles size={18} /> Generate Questions</>}
                </button>
              </div>
            ) : (
              <div className="questions-list">
                {questions.map((q, i) => (
                  <QuestionCard key={i} question={q} index={i} />
                ))}
                <button className="btn btn-secondary" onClick={runQuestions} disabled={loading.questions}>
                  {loading.questions ? <span className="btn-loader" /> : <><Sparkles size={16} /> Generate New Questions</>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, index }) {
  const [expanded, setExpanded] = useState(false);
  const catColors = {
    Behavioral: 'badge-primary',
    Technical: 'badge-success',
    Situational: 'badge-warning',
    'Project Deep-Dive': 'badge-danger',
    'Career Growth': 'badge-primary',
  };

  return (
    <div className="question-card card">
      <div className="question-header" onClick={() => setExpanded(!expanded)}>
        <div className="question-num">Q{index + 1}</div>
        <div className="question-main">
          <span className={`badge ${catColors[question.category] || 'badge-primary'}`}>{question.category}</span>
          <p className="question-text">{question.question}</p>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {expanded && (
        <div className="question-tips">
          <div className="tips-label"><Lightbulb size={14} /> Preparation Tips:</div>
          <p>{question.tips}</p>
        </div>
      )}
    </div>
  );
}
