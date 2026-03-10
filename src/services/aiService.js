// AI Service - Provides resume analysis, scoring, job recommendations, and interview questions
// Uses a built-in analysis engine. Can be extended with Google Gemini API.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ── Resume Analysis ──
export async function analyzeResume(resume) {
  await delay(1500 + Math.random() * 1000);

  const suggestions = [];
  const scores = {};

  // Personal Info check
  const pi = resume.personalInfo;
  let personalScore = 100;
  if (!pi.summary || pi.summary.length < 50) {
    suggestions.push({
      category: 'Personal Info',
      type: 'warning',
      message: 'Add a compelling professional summary (at least 2-3 sentences) to make a strong first impression.',
    });
    personalScore -= 20;
  }
  if (!pi.linkedin) {
    suggestions.push({ category: 'Personal Info', type: 'tip', message: 'Add your LinkedIn profile URL to increase credibility.' });
    personalScore -= 10;
  }
  if (!pi.github) {
    suggestions.push({ category: 'Personal Info', type: 'tip', message: 'Include your GitHub profile to showcase your code.' });
    personalScore -= 5;
  }
  if (!pi.website) {
    suggestions.push({ category: 'Personal Info', type: 'info', message: 'Consider adding a personal website or portfolio link.' });
    personalScore -= 5;
  }
  scores.personalInfo = Math.max(0, personalScore);

  // Skills check
  let skillsScore = 100;
  if (resume.skills.length === 0) {
    suggestions.push({ category: 'Skills', type: 'critical', message: 'Add your technical and soft skills. This is one of the most important sections.' });
    skillsScore = 0;
  } else if (resume.skills.length < 5) {
    suggestions.push({ category: 'Skills', type: 'warning', message: 'Consider adding more skills. Most competitive resumes list 8-15 relevant skills.' });
    skillsScore -= 30;
  }
  const hasLevels = resume.skills.every(s => s.level);
  if (!hasLevels && resume.skills.length > 0) {
    suggestions.push({ category: 'Skills', type: 'tip', message: 'Add proficiency levels to your skills for better clarity.' });
    skillsScore -= 10;
  }
  scores.skills = Math.max(0, skillsScore);

  // Experience check
  let expScore = 100;
  if (resume.experience.length === 0) {
    suggestions.push({ category: 'Experience', type: 'critical', message: 'Add your work experience. Even internships and freelance work count.' });
    expScore = 0;
  } else {
    const withoutHighlights = resume.experience.filter(e => !e.highlights || e.highlights.length === 0);
    if (withoutHighlights.length > 0) {
      suggestions.push({ category: 'Experience', type: 'warning', message: 'Add bullet points highlighting achievements for each experience entry. Use action verbs and quantify results.' });
      expScore -= 20;
    }
    const shortDescs = resume.experience.filter(e => !e.description || e.description.length < 30);
    if (shortDescs.length > 0) {
      suggestions.push({ category: 'Experience', type: 'tip', message: 'Expand your role descriptions to give recruiters more context.' });
      expScore -= 10;
    }
  }
  scores.experience = Math.max(0, expScore);

  // Education check
  let eduScore = 100;
  if (resume.education.length === 0) {
    suggestions.push({ category: 'Education', type: 'warning', message: 'Add your educational background, including degrees, bootcamps, or relevant courses.' });
    eduScore = 30;
  }
  scores.education = Math.max(0, eduScore);

  // Projects check
  let projScore = 100;
  if (resume.projects.length === 0) {
    suggestions.push({ category: 'Projects', type: 'warning', message: 'Add personal or open-source projects to showcase practical skills.' });
    projScore = 40;
  } else if (resume.projects.length < 2) {
    suggestions.push({ category: 'Projects', type: 'tip', message: 'Consider adding more projects to strengthen your portfolio.' });
    projScore -= 20;
  }
  scores.projects = Math.max(0, projScore);

  // Certifications check
  let certScore = 100;
  if (resume.certifications.length === 0) {
    suggestions.push({ category: 'Certifications', type: 'info', message: 'Professional certifications can significantly boost your resume. Consider adding relevant ones.' });
    certScore = 60;
  }
  scores.certifications = Math.max(0, certScore);

  // Overall score
  const weights = { personalInfo: 0.15, skills: 0.2, experience: 0.3, education: 0.1, projects: 0.15, certifications: 0.1 };
  const overallScore = Math.round(
    Object.entries(weights).reduce((sum, [key, weight]) => sum + (scores[key] || 0) * weight, 0)
  );

  // General suggestions
  if (overallScore >= 85) {
    suggestions.push({ category: 'Overall', type: 'success', message: 'Your resume is strong! Keep it updated and tailored for specific roles.' });
  } else if (overallScore >= 60) {
    suggestions.push({ category: 'Overall', type: 'info', message: 'Your resume is good but has room for improvement. Focus on the warning items above.' });
  } else {
    suggestions.push({ category: 'Overall', type: 'warning', message: 'Your resume needs significant improvements. Address the critical items first.' });
  }

  return {
    overallScore,
    sectionScores: scores,
    suggestions,
    analyzedAt: new Date().toISOString(),
  };
}

// ── Job Role Scoring ──
export async function scoreForRole(resume, jobTitle) {
  await delay(1200 + Math.random() * 800);

  const jobTitle_lower = jobTitle.toLowerCase();
  const allSkills = resume.skills.map(s => s.name.toLowerCase());
  const allExp = resume.experience.map(e => `${e.position} ${e.description} ${(e.highlights || []).join(' ')}`).join(' ').toLowerCase();

  const roleKeywords = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'next.js', 'tailwind', 'ui', 'ux', 'responsive'],
    'backend': ['node.js', 'python', 'java', 'express', 'api', 'database', 'sql', 'rest', 'graphql', 'microservices', 'redis'],
    'fullstack': ['react', 'node.js', 'javascript', 'typescript', 'database', 'api', 'full stack', 'full-stack', 'frontend', 'backend'],
    'devops': ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform', 'cloud', 'linux', 'monitoring', 'ansible'],
    'data': ['python', 'sql', 'machine learning', 'data analysis', 'pandas', 'tensorflow', 'statistics', 'tableau', 'spark'],
    'mobile': ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'mobile', 'app development'],
    'product': ['agile', 'scrum', 'product management', 'roadmap', 'stakeholder', 'metrics', 'user research'],
    'design': ['figma', 'sketch', 'ui/ux', 'user experience', 'prototyping', 'design system', 'wireframe'],
  };

  let matchedRole = 'fullstack';
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    if (jobTitle_lower.includes(role) || keywords.some(k => jobTitle_lower.includes(k))) {
      matchedRole = role;
      break;
    }
  }

  const keywords = roleKeywords[matchedRole] || roleKeywords['fullstack'];
  const matchedSkills = keywords.filter(k => allSkills.some(s => s.includes(k)));
  const matchedInExp = keywords.filter(k => allExp.includes(k));
  const allMatched = [...new Set([...matchedSkills, ...matchedInExp])];
  const missingSkills = keywords.filter(k => !allMatched.includes(k));

  const skillMatch = Math.round((matchedSkills.length / keywords.length) * 100);
  const expMatch = Math.round((matchedInExp.length / keywords.length) * 100);
  const overallFit = Math.round(skillMatch * 0.5 + expMatch * 0.3 + (resume.projects.length > 0 ? 20 : 0));

  return {
    jobTitle,
    overallFit: Math.min(100, overallFit),
    skillMatch: Math.min(100, skillMatch),
    experienceMatch: Math.min(100, expMatch),
    matchedKeywords: allMatched,
    missingSkills: missingSkills.slice(0, 5),
    recommendations: [
      missingSkills.length > 0 ? `Consider learning: ${missingSkills.slice(0, 3).join(', ')}` : 'Your skills align well with this role!',
      matchedSkills.length > 3 ? 'Strong technical skill match for this position.' : 'Consider highlighting more role-specific skills.',
      resume.projects.length > 0 ? 'Your project portfolio strengthens your application.' : 'Add relevant projects to stand out.',
    ],
  };
}

// ── Job Recommendations ──
export async function getJobRecommendations(resume) {
  await delay(1000 + Math.random() * 800);

  const skills = resume.skills.map(s => s.name.toLowerCase());
  const currentTitle = resume.personalInfo.title?.toLowerCase() || '';
  const expYears = resume.experience.length * 2;

  const allJobs = [
    { title: 'Senior Frontend Developer', company: 'Meta', location: 'Menlo Park, CA', salary: '$180K - $250K', skills: ['react', 'javascript', 'typescript'], type: 'Full-time' },
    { title: 'Full Stack Engineer', company: 'Stripe', location: 'San Francisco, CA', salary: '$170K - $240K', skills: ['react', 'node.js', 'postgresql'], type: 'Full-time' },
    { title: 'Backend Developer', company: 'Spotify', location: 'Stockholm / Remote', salary: '$150K - $200K', skills: ['python', 'node.js', 'microservices'], type: 'Full-time' },
    { title: 'DevOps Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$200K - $300K', skills: ['aws', 'docker', 'kubernetes'], type: 'Full-time' },
    { title: 'React Developer', company: 'Vercel', location: 'Remote', salary: '$140K - $200K', skills: ['react', 'next.js', 'typescript'], type: 'Full-time' },
    { title: 'Software Engineer II', company: 'Google', location: 'Mountain View, CA', salary: '$190K - $280K', skills: ['python', 'javascript', 'cloud'], type: 'Full-time' },
    { title: 'Cloud Engineer', company: 'AWS', location: 'Seattle, WA', salary: '$160K - $220K', skills: ['aws', 'python', 'terraform'], type: 'Full-time' },
    { title: 'Staff Frontend Engineer', company: 'Airbnb', location: 'San Francisco, CA', salary: '$210K - $290K', skills: ['react', 'typescript', 'graphql'], type: 'Full-time' },
    { title: 'Platform Engineer', company: 'Datadog', location: 'New York, NY', salary: '$170K - $230K', skills: ['go', 'kubernetes', 'monitoring'], type: 'Full-time' },
    { title: 'Mobile Developer', company: 'Uber', location: 'San Francisco, CA', salary: '$175K - $250K', skills: ['react native', 'kotlin', 'swift'], type: 'Full-time' },
    { title: 'Data Engineer', company: 'Snowflake', location: 'San Mateo, CA', salary: '$165K - $235K', skills: ['python', 'sql', 'spark'], type: 'Full-time' },
    { title: 'Product Manager (Technical)', company: 'Slack', location: 'San Francisco, CA', salary: '$180K - $260K', skills: ['product management', 'agile', 'analytics'], type: 'Full-time' },
  ];

  const scored = allJobs.map(job => {
    const skillOverlap = job.skills.filter(s => skills.some(us => us.toLowerCase().includes(s))).length;
    const titleSimilarity = currentTitle.includes(job.title.toLowerCase().split(' ')[0]) ? 2 : 0;
    const score = (skillOverlap / job.skills.length) * 70 + titleSimilarity * 10 + Math.min(expYears * 3, 20);
    return { ...job, matchScore: Math.min(100, Math.round(score)) };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);
}

// ── Interview Questions ──
export async function generateInterviewQuestions(resume) {
  await delay(1500 + Math.random() * 1000);

  const questions = [];
  const title = resume.personalInfo.title || 'Developer';
  const topSkills = resume.skills.slice(0, 5).map(s => s.name);

  // Behavioral
  questions.push({
    category: 'Behavioral',
    question: `Tell me about a challenging project you worked on as a ${title}. How did you approach it?`,
    tips: 'Use the STAR method (Situation, Task, Action, Result). Reference specific projects from your resume.',
  });

  if (resume.experience.length > 1) {
    questions.push({
      category: 'Behavioral',
      question: `You moved from ${resume.experience[resume.experience.length - 1]?.company || 'your previous role'} to ${resume.experience[0]?.company || 'your current role'}. What motivated this transition?`,
      tips: 'Focus on growth, new challenges, and alignment with career goals. Avoid negative talk about previous employers.',
    });
  }

  questions.push({
    category: 'Behavioral',
    question: 'Describe a time when you had to work with a difficult team member. How did you handle it?',
    tips: 'Show emotional intelligence and conflict resolution skills. Focus on positive outcomes.',
  });

  // Technical
  if (topSkills.length > 0) {
    questions.push({
      category: 'Technical',
      question: `Can you explain a complex ${topSkills[0]} concept you recently used in a project?`,
      tips: `Reference your projects that used ${topSkills[0]}. Explain the concept simply, then go into technical details.`,
    });
  }

  if (topSkills.length > 1) {
    questions.push({
      category: 'Technical',
      question: `How would you compare ${topSkills[0]} and ${topSkills[1]} in terms of their strengths and use cases?`,
      tips: 'Show deep understanding of both technologies. Mention specific scenarios from your experience.',
    });
  }

  questions.push({
    category: 'Technical',
    question: 'How do you approach debugging a complex issue in production?',
    tips: 'Describe your systematic approach: logging, monitoring, reproducing, isolating, fixing, and preventing recurrence.',
  });

  // Situational
  questions.push({
    category: 'Situational',
    question: 'If you were given a tight deadline for a feature with unclear requirements, how would you handle it?',
    tips: 'Show initiative in clarifying requirements, prioritizing MVP, and communicating with stakeholders.',
  });

  questions.push({
    category: 'Situational',
    question: `Given your experience with ${topSkills.slice(0, 3).join(', ')}, how would you architect a scalable web application?`,
    tips: 'Discuss technology choices, separation of concerns, database design, caching, and deployment strategy.',
  });

  // Role-specific
  if (resume.projects.length > 0) {
    const proj = resume.projects[0];
    questions.push({
      category: 'Project Deep-Dive',
      question: `Tell me about your project "${proj.name}". What was the biggest technical challenge?`,
      tips: `Discuss the architecture, technical decisions, and impact. Mention: ${proj.technologies?.join(', ') || 'the technologies used'}.`,
    });
  }

  questions.push({
    category: 'Career Growth',
    question: 'Where do you see yourself in 3-5 years?',
    tips: 'Show ambition aligned with the role. Mention leadership, technical depth, or specialization goals.',
  });

  return questions;
}

// ── Skill Gap Analysis ──
export async function analyzeSkillGaps(resume, targetRole) {
  await delay(1000);

  const roleRequirements = {
    'Frontend Developer': { required: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'], nice: ['Next.js', 'Testing', 'Accessibility', 'Performance'] },
    'Backend Developer': { required: ['Node.js', 'Python', 'SQL', 'API Design', 'Security'], nice: ['Docker', 'Redis', 'Message Queues', 'Monitoring'] },
    'Full Stack Developer': { required: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git'], nice: ['TypeScript', 'Docker', 'AWS', 'Testing', 'CI/CD'] },
    'DevOps Engineer': { required: ['Linux', 'Docker', 'CI/CD', 'Cloud (AWS/GCP)', 'Scripting'], nice: ['Kubernetes', 'Terraform', 'Monitoring', 'Security'] },
    'Data Scientist': { required: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'], nice: ['Deep Learning', 'Big Data', 'Cloud', 'NLP'] },
  };

  const match = roleRequirements[targetRole] || roleRequirements['Full Stack Developer'];
  const userSkills = resume.skills.map(s => s.name.toLowerCase());

  const hasSkill = (skill) => userSkills.some(us => us.includes(skill.toLowerCase()));

  return {
    role: targetRole,
    requiredSkills: match.required.map(s => ({ name: s, has: hasSkill(s) })),
    niceToHaveSkills: match.nice.map(s => ({ name: s, has: hasSkill(s) })),
    coverage: Math.round((match.required.filter(s => hasSkill(s)).length / match.required.length) * 100),
  };
}
