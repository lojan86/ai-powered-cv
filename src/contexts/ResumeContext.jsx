import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ResumeContext = createContext(null);

const createEmptyResume = (userId) => ({
  id: `resume-${Date.now()}`,
  userId,
  title: 'My Resume',
  slug: `resume-${Date.now().toString(36)}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  versions: [],
  currentVersion: 1,
  isPublic: true,
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
});

const DEMO_RESUME = {
  id: 'resume-demo-1',
  userId: 'user-1',
  title: 'Full Stack Developer Resume',
  slug: 'alex-johnson-resume',
  createdAt: '2025-10-15T10:00:00Z',
  updatedAt: '2026-03-10T08:00:00Z',
  versions: [
    { version: 1, date: '2025-10-15T10:00:00Z', label: 'Initial version' },
    { version: 2, date: '2026-01-05T14:00:00Z', label: 'Added AWS certification' },
    { version: 3, date: '2026-03-10T08:00:00Z', label: 'Updated projects section' },
  ],
  currentVersion: 3,
  isPublic: true,
  personalInfo: {
    fullName: 'Alex Johnson',
    title: 'Senior Full Stack Developer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Committed to writing clean, maintainable code and delivering exceptional user experiences.',
  },
  skills: [
    { id: 's1', name: 'React', level: 'Expert', category: 'Frontend' },
    { id: 's2', name: 'TypeScript', level: 'Advanced', category: 'Frontend' },
    { id: 's3', name: 'Node.js', level: 'Expert', category: 'Backend' },
    { id: 's4', name: 'Python', level: 'Advanced', category: 'Backend' },
    { id: 's5', name: 'PostgreSQL', level: 'Advanced', category: 'Database' },
    { id: 's6', name: 'MongoDB', level: 'Intermediate', category: 'Database' },
    { id: 's7', name: 'AWS', level: 'Advanced', category: 'Cloud' },
    { id: 's8', name: 'Docker', level: 'Advanced', category: 'DevOps' },
    { id: 's9', name: 'GraphQL', level: 'Intermediate', category: 'Backend' },
    { id: 's10', name: 'Next.js', level: 'Advanced', category: 'Frontend' },
    { id: 's11', name: 'TailwindCSS', level: 'Expert', category: 'Frontend' },
    { id: 's12', name: 'Git', level: 'Expert', category: 'Tools' },
  ],
  experience: [
    {
      id: 'e1',
      company: 'TechVenture Inc.',
      position: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      startDate: '2023-03',
      endDate: '',
      current: true,
      description: 'Lead developer for the core platform team, architecting and building scalable microservices serving 2M+ users.',
      highlights: [
        'Redesigned the frontend architecture using React and Next.js, improving page load times by 40%',
        'Led a team of 5 developers in building a real-time collaboration feature',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored junior developers and conducted code reviews',
      ],
    },
    {
      id: 'e2',
      company: 'DataFlow Solutions',
      position: 'Full Stack Developer',
      location: 'Austin, TX',
      startDate: '2021-06',
      endDate: '2023-02',
      current: false,
      description: 'Built data visualization dashboards and internal tools for enterprise clients.',
      highlights: [
        'Developed interactive data dashboards using React and D3.js for Fortune 500 clients',
        'Built RESTful APIs using Node.js and Express, handling 10K+ requests per minute',
        'Migrated legacy jQuery codebase to React, reducing bundle size by 35%',
      ],
    },
    {
      id: 'e3',
      company: 'StartupLabs',
      position: 'Junior Developer',
      location: 'Remote',
      startDate: '2020-01',
      endDate: '2021-05',
      current: false,
      description: 'Full-stack development for early-stage startup building a SaaS platform.',
      highlights: [
        'Built the MVP from scratch using React and Firebase',
        'Implemented user authentication and authorization system',
        'Integrated Stripe payment processing for subscription management',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: '3.8',
      highlights: ['Dean\'s List (6 semesters)', 'CS Teaching Assistant', 'ACM Programming Club President'],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'CloudDeploy',
      description: 'Open-source deployment automation tool that simplifies deploying applications to multiple cloud providers.',
      technologies: ['Go', 'React', 'Docker', 'Kubernetes'],
      url: 'https://github.com/alexjohnson/clouddeploy',
      highlights: ['1.2K+ GitHub stars', 'Used by 50+ companies', 'Featured on Hacker News'],
    },
    {
      id: 'p2',
      name: 'DevMetrics',
      description: 'Real-time development analytics dashboard that tracks team productivity and code quality metrics.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      url: 'https://devmetrics.io',
      highlights: ['Processes 1M+ events daily', '99.9% uptime', 'SOC2 compliant'],
    },
    {
      id: 'p3',
      name: 'AIChat Widget',
      description: 'Embeddable AI-powered chat widget for customer support with natural language understanding.',
      technologies: ['TypeScript', 'OpenAI API', 'WebSocket', 'React'],
      url: 'https://github.com/alexjohnson/aichat',
      highlights: ['Reduces support tickets by 35%', '500+ active installations'],
    },
  ],
  certifications: [
    {
      id: 'c1',
      name: 'AWS Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2025-08',
      expiry: '2028-08',
      credentialId: 'AWS-SAA-001234',
    },
    {
      id: 'c2',
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2025-03',
      expiry: '2027-03',
      credentialId: 'GCP-PD-005678',
    },
  ],
  languages: [
    { id: 'l1', name: 'English', proficiency: 'Native' },
    { id: 'l2', name: 'Spanish', proficiency: 'Conversational' },
  ],
  achievements: [
    'Winner, HackSF 2024 Hackathon (AI Track)',
    'Speaker at ReactConf 2025 - "Scaling React Applications"',
    'Published technical articles with 50K+ total views on Dev.to',
  ],
};

export function ResumeProvider({ children }) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cv_resumes') || '[]');
    const withDemo = stored.find(r => r.id === 'resume-demo-1') ? stored : [DEMO_RESUME, ...stored];
    setResumes(withDemo);
  }, []);

  useEffect(() => {
    if (resumes.length > 0) {
      localStorage.setItem('cv_resumes', JSON.stringify(resumes));
    }
  }, [resumes]);

  const getUserResumes = () => {
    if (!user) return [];
    return resumes.filter(r => r.userId === user.id);
  };

  const getAllPublicResumes = () => {
    return resumes.filter(r => r.isPublic);
  };

  const getResumeBySlug = (slug) => {
    return resumes.find(r => r.slug === slug);
  };

  const getResumeById = (id) => {
    return resumes.find(r => r.id === id);
  };

  const createResume = () => {
    if (!user) return null;
    const newResume = createEmptyResume(user.id);
    newResume.personalInfo.fullName = user.name;
    newResume.personalInfo.email = user.email;
    setResumes(prev => [...prev, newResume]);
    return newResume;
  };

  const updateResume = (resumeId, updates) => {
    setResumes(prev =>
      prev.map(r =>
        r.id === resumeId
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const saveVersion = (resumeId, label = '') => {
    setResumes(prev =>
      prev.map(r => {
        if (r.id !== resumeId) return r;
        const newVersion = r.currentVersion + 1;
        return {
          ...r,
          currentVersion: newVersion,
          versions: [
            ...r.versions,
            { version: newVersion, date: new Date().toISOString(), label: label || `Version ${newVersion}` },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteResume = (resumeId) => {
    setResumes(prev => prev.filter(r => r.id !== resumeId));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        setCurrentResume,
        getUserResumes,
        getAllPublicResumes,
        getResumeBySlug,
        getResumeById,
        createResume,
        updateResume,
        saveVersion,
        deleteResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within ResumeProvider');
  return context;
}
