import { Link } from 'react-router-dom';
import {
  FileText, Sparkles, Share2, Download, BarChart3, Search,
  Users, Shield, Zap, ArrowRight, Star, Globe, Clock,
  CheckCircle, Brain, Target, MessageSquare, TrendingUp
} from 'lucide-react';
import './Landing.css';

const features = [
  { icon: <FileText size={24} />, title: 'Dynamic Resume Builder', desc: 'Create beautiful, interactive resumes with our intuitive editor. Update anytime, anywhere.' },
  { icon: <Share2 size={24} />, title: 'Shareable Links', desc: 'Generate unique resume links. Recruiters always see your latest version.' },
  { icon: <Sparkles size={24} />, title: 'AI-Powered Analysis', desc: 'Get intelligent suggestions to improve your resume and increase interview chances.' },
  { icon: <BarChart3 size={24} />, title: 'Resume Scoring', desc: 'Score your resume against specific job roles and identify skill gaps.' },
  { icon: <Brain size={24} />, title: 'AI Interview Prep', desc: 'Generate personalized interview questions based on your resume content.' },
  { icon: <Download size={24} />, title: 'PDF Export', desc: 'Download your resume as a professionally formatted PDF anytime.' },
  { icon: <Clock size={24} />, title: 'Version Control', desc: 'Track resume versions for different job applications and roll back changes.' },
  { icon: <Search size={24} />, title: 'Recruiter Search', desc: 'Recruiters can find candidates by skills, experience, and qualifications.' },
];

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up and fill in your professional details, skills, and experience.', icon: <Users size={28} /> },
  { num: '02', title: 'Build Your Resume', desc: 'Use our AI-assisted builder to craft a compelling, professional resume.', icon: <FileText size={28} /> },
  { num: '03', title: 'Share Your Link', desc: 'Get a unique URL to share with recruiters. Update anytime, they always see the latest.', icon: <Globe size={28} /> },
  { num: '04', title: 'Get AI Insights', desc: 'Receive AI-powered analysis, job matching, and interview preparation.', icon: <Sparkles size={28} /> },
];

const testimonials = [
  { name: 'Emily Rodriguez', role: 'Software Engineer at Google', text: 'ResumeAI transformed my job search. The AI suggestions helped me land 3x more interviews!', rating: 5 },
  { name: 'James Park', role: 'Product Manager at Meta', text: 'The dynamic resume link is a game-changer. Recruiters loved that my resume was always up-to-date.', rating: 5 },
  { name: 'Sarah Mitchell', role: 'Tech Recruiter at Stripe', text: 'As a recruiter, the candidate search feature saves me hours. I can find the right talent instantly.', rating: 5 },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '120K+', label: 'Resumes Created' },
  { value: '85%', label: 'Interview Rate' },
  { value: '200+', label: 'Partner Companies' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in-up">
            <Sparkles size={14} />
            <span>AI-Powered Resume Platform</span>
          </div>
          <h1 className="hero-title animate-fade-in-up stagger-1">
            Your Resume,{' '}
            <span className="gradient-text">Always Alive</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up stagger-2">
            Stop sending static PDFs that go stale. Create a dynamic, AI-enhanced resume 
            with a shareable link that recruiters love. Update anytime, impress always.
          </p>
          <div className="hero-actions animate-fade-in-up stagger-3">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              See Features
            </a>
          </div>
          <div className="hero-stats animate-fade-in-up stagger-4">
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Zap size={14} /> Features
            </span>
            <h2 className="section-title">Everything You Need to <span className="gradient-text">Stand Out</span></h2>
            <p className="section-subtitle">
              From AI-powered analysis to recruiter tools, we've built everything you need to land your dream job.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Target size={14} /> How It Works
            </span>
            <h2 className="section-title">Get Started in <span className="gradient-text">4 Simple Steps</span></h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-icon-wrap">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="ai-showcase">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Brain size={14} /> AI-Powered
            </span>
            <h2 className="section-title">Supercharge Your Resume with <span className="gradient-text">AI</span></h2>
          </div>
          <div className="ai-features-grid">
            <div className="ai-feature-card">
              <div className="ai-feature-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <BarChart3 size={28} />
              </div>
              <h3>Smart Resume Scoring</h3>
              <p>Get a detailed score breakdown for each section of your resume with actionable improvement tips.</p>
              <div className="ai-preview">
                <div className="score-preview">
                  <div className="score-ring">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                        strokeDasharray="264" strokeDashoffset="40" strokeLinecap="round"
                        transform="rotate(-90 50 50)" />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="score-num">85</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ai-feature-card">
              <div className="ai-feature-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                <Target size={28} />
              </div>
              <h3>Job Role Matching</h3>
              <p>See how well your resume matches specific job roles and discover skill gaps to fill.</p>
              <div className="ai-preview">
                {['Frontend Developer', 'Full Stack Engineer', 'DevOps Engineer'].map((role, i) => (
                  <div key={i} className="match-preview-item">
                    <span>{role}</span>
                    <div className="match-bar-sm">
                      <div className="match-fill-sm" style={{ width: `${90 - i * 15}%` }} />
                    </div>
                    <span className="match-pct">{90 - i * 15}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ai-feature-card">
              <div className="ai-feature-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #0ea5e9)' }}>
                <MessageSquare size={28} />
              </div>
              <h3>Interview Prep AI</h3>
              <p>Generate personalized interview questions with tips based on your experience and skills.</p>
              <div className="ai-preview">
                <div className="interview-preview">
                  <div className="q-badge">Behavioral</div>
                  <p className="q-text">"Tell me about a challenging project..."</p>
                  <div className="q-badge q-tech">Technical</div>
                  <p className="q-text">"Explain React's reconciliation..."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Star size={14} /> Testimonials
            </span>
            <h2 className="section-title">Loved by <span className="gradient-text">Thousands</span></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg">
              <div className="cta-orb cta-orb-1" />
              <div className="cta-orb cta-orb-2" />
            </div>
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Career?</h2>
              <p className="cta-subtitle">
                Join thousands of professionals who landed their dream jobs with ResumeAI.
              </p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Your Resume <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="navbar-brand">
              <div className="brand-icon"><FileText size={20} /></div>
              <span className="brand-text">Resume<span className="brand-ai">AI</span></span>
            </div>
            <p className="footer-desc">
              The AI-powered platform for dynamic, always-updated resumes.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/register">Create Resume</Link>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div className="footer-col">
              <h4>For Recruiters</h4>
              <Link to="/register">Sign Up</Link>
              <a href="#features">Search Candidates</a>
              <a href="#features">Dashboard</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
