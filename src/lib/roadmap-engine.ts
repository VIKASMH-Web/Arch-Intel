/**
 * Roadmap Generator Engine
 * Generates instant, dynamic roadmaps using rule-based logic
 * No paid APIs required
 */

import technicalRoadmaps from '../data/technicalRoadmaps.json';
import nonTechnicalRoadmaps from '../data/nonTechnicalRoadmaps.json';
import resourceDatabase from '../data/resourceDatabase.json';
import toolLibrary from '../data/toolLibrary.json';

// ============================
// KEYWORD DETECTION
// ============================
const TECHNICAL_KEYWORDS = [
  'developer', 'engineer', 'programming', 'coding', 'software',
  'data', 'ai', 'ml', 'cloud', 'devops', 'cyber', 'security',
  'frontend', 'backend', 'fullstack', 'full stack', 'mobile',
  'web', 'api', 'database', 'server', 'algorithm', 'python',
  'javascript', 'java', 'react', 'nodejs', 'node.js', 'angular',
  'vue', 'typescript', 'c++', 'c#', 'rust', 'go', 'golang',
  'ruby', 'php', 'swift', 'kotlin', 'flutter', 'dart',
  'sql', 'nosql', 'mongodb', 'postgresql', 'mysql',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux',
  'machine learning', 'deep learning', 'neural', 'tensorflow',
  'pytorch', 'scikit', 'pandas', 'numpy', 'html', 'css',
  'blockchain', 'ethereum', 'solidity', 'smart contract'
];

const DOMAIN_KEYWORD_MAP: Record<string, string> = {
  // Technical
  'python': 'python',
  'javascript': 'javascript', 'js': 'javascript',
  'java': 'java',
  'react': 'react', 'reactjs': 'react', 'react.js': 'react',
  'node': 'nodejs', 'nodejs': 'nodejs', 'node.js': 'nodejs',
  'data science': 'data_science', 'data scientist': 'data_science', 'data analysis': 'data_science', 'data analyst': 'data_science',
  'devops': 'devops', 'dev ops': 'devops',
  'cloud': 'cloud', 'cloud engineer': 'cloud', 'cloud computing': 'cloud', 'aws': 'cloud', 'azure': 'cloud', 'gcp': 'cloud',
  'cybersecurity': 'cybersecurity', 'cyber security': 'cybersecurity', 'security engineer': 'cybersecurity', 'ethical hacking': 'cybersecurity',
  'ai': 'ai_ml', 'artificial intelligence': 'ai_ml', 'machine learning': 'ai_ml', 'ml engineer': 'ai_ml', 'deep learning': 'ai_ml',
  'backend': 'backend', 'backend developer': 'backend', 'back end': 'backend',
  'frontend': 'frontend', 'frontend developer': 'frontend', 'front end': 'frontend',
  'full stack': 'fullstack', 'fullstack': 'fullstack', 'full-stack': 'fullstack',
  'mobile': 'mobile', 'mobile developer': 'mobile', 'app developer': 'mobile', 'react native': 'mobile', 'flutter': 'mobile',
  'sql': 'sql', 'database': 'sql', 'mysql': 'sql', 'postgresql': 'sql',
  // Non-Technical
  'hr': 'hr_manager', 'hr manager': 'hr_manager', 'human resources': 'hr_manager', 'human resource': 'hr_manager',
  'digital marketing': 'digital_marketing', 'marketing': 'digital_marketing', 'seo': 'digital_marketing', 'social media marketing': 'digital_marketing',
  'product manager': 'product_manager', 'product management': 'product_manager', 'pm': 'product_manager',
  'ui': 'ui_ux_design', 'ux': 'ui_ux_design', 'ui/ux': 'ui_ux_design', 'ui ux': 'ui_ux_design', 'ui design': 'ui_ux_design', 'ux design': 'ui_ux_design',
  'content writing': 'content_writing', 'content writer': 'content_writing', 'copywriting': 'content_writing', 'technical writing': 'content_writing',
  'business analyst': 'business_analyst', 'business analysis': 'business_analyst',
  'project manager': 'project_manager', 'project management': 'project_manager',
  'upsc': 'upsc', 'civil services': 'upsc', 'ias': 'upsc',
  'sales': 'sales', 'sales manager': 'sales', 'business development': 'sales',
  'finance': 'finance', 'financial analyst': 'finance', 'accounting': 'finance', 'cfa': 'finance',
};

// ============================
// DETECT DOMAIN TYPE
// ============================
export function detectDomainType(query: string) {
  const lower = query.toLowerCase().trim();
  const isTechnical = TECHNICAL_KEYWORDS.some(kw => lower.includes(kw));
  return isTechnical ? 'technical' : 'non-technical';
}

// ============================
// MATCH DOMAIN KEY
// ============================
export function matchDomainKey(query: string) {
  const lower = query.toLowerCase().trim();
  
  // First try exact match
  if (DOMAIN_KEYWORD_MAP[lower]) {
    return DOMAIN_KEYWORD_MAP[lower];
  }
  
  // Then try partial match (longer keywords first for better matching)
  const sortedKeys = Object.keys(DOMAIN_KEYWORD_MAP).sort((a, b) => b.length - a.length);
  for (const keyword of sortedKeys) {
    if (lower.includes(keyword)) {
      return DOMAIN_KEYWORD_MAP[keyword];
    }
  }
  
  return null;
}

// ============================
// GENERATE ROADMAP
// ============================
export function generateRoadmap(query: string) {
  const type = detectDomainType(query);
  const domainKey = matchDomainKey(query);
  const lower = query.toLowerCase().trim();
  
  let roadmap: any;
  let label: string;
  const techData = technicalRoadmaps as any;
  const nonTechData = nonTechnicalRoadmaps as any;
  
  if (type === 'technical') {
    roadmap = domainKey && techData[domainKey] 
      ? techData[domainKey] 
      : techData['_default'];
    
    // If using default, customize with query name
    if (!domainKey || !techData[domainKey]) {
      label = capitalize(query) + ' Developer';
      roadmap = {
        ...roadmap,
        label,
        stages: roadmap.stages.map((stage: any) => ({
          ...stage,
          title: stage.title.replace('Fundamentals', `${capitalize(query)} Basics`)
            .replace('Core Concepts', `${capitalize(query)} Core Concepts`)
            .replace('Tools & Ecosystem', `${capitalize(query)} Tools & Ecosystem`)
        }))
      };
    } else {
      label = roadmap.label;
    }
  } else {
    roadmap = domainKey && nonTechData[domainKey]
      ? nonTechData[domainKey]
      : nonTechData['_default'];
    
    if (!domainKey || !nonTechData[domainKey]) {
      label = capitalize(query);
      roadmap = {
        ...roadmap,
        label,
        stages: roadmap.stages.map((stage: any) => ({
          ...stage,
          title: stage.title.replace('Fundamentals', `${capitalize(query)} Fundamentals`)
        }))
      };
    } else {
      label = roadmap.label;
    }
  }
  
  return {
    label,
    type,
    domainKey: domainKey || lower.replace(/\s+/g, '_'),
    stages: roadmap.stages,
    query: query
  };
}

// ============================
// GET RESOURCES FOR DOMAIN
// ============================
export function getResourcesForDomain(domainKey: string, query = '') {
  const searchQuery = query || domainKey.replace(/_/g, ' ');
  const q = encodeURIComponent(searchQuery);
  const capQ = capitalize(searchQuery);

  return [
    {
      title: `${capQ} Official Documentation`,
      source: 'Official Docs & DevDocs',
      type: 'Documentation',
      link: `https://devdocs.io/search?q=${q}`
    },
    {
      title: `${capQ} Developer Roadmap`,
      source: 'roadmap.sh',
      type: 'Roadmap',
      link: `https://roadmap.sh/search?q=${q}`
    },
    {
      title: `${capQ} Handwritten Notes & Repos`,
      source: 'GitHub',
      type: 'Notes',
      link: `https://github.com/search?q=${q}+handwritten+notes&type=repositories`
    },
    {
      title: `${capQ} Free Text Tutorials & Articles`,
      source: 'freeCodeCamp',
      type: 'Tutorial',
      link: `https://www.freecodecamp.org/news/search/?query=${q}`
    },
    {
      title: `${capQ} Cheatsheet (PDF)`,
      source: 'Google Search',
      type: 'Cheatsheet',
      link: `https://www.google.com/search?q=${q}+cheatsheet+filetype:pdf`
    },
    {
      title: `${capQ} Video Crash Course`,
      source: 'YouTube',
      type: 'Video',
      link: `https://www.youtube.com/results?search_query=${q}+crash+course+full+tutorial`
    }
  ];
}

// ============================
// GET TOOLS FOR DOMAIN
// ============================
export function getToolsForDomain(domainKey: string) {
  const allTools: any[] = [];
  const tools = toolLibrary as any;
  
  for (const category of Object.values(tools)) {
    for (const tool of (category as any[])) {
      if (tool.tags.includes('all') || tool.tags.includes(domainKey)) {
        allTools.push(tool);
      }
    }
  }
  
  // If no domain-specific tools found, return general ones
  if (allTools.length === 0) {
    for (const category of Object.values(tools)) {
      for (const tool of (category as any[])) {
        if (tool.tags.includes('all')) {
          allTools.push(tool);
        }
      }
    }
  }
  
  return allTools;
}

// ============================
// SEARCH CACHE
// ============================
const searchCache = new Map();
const MAX_CACHE = 5;

export function getCachedSearch(query: string) {
  return searchCache.get(query.toLowerCase().trim());
}

export function cacheSearch(query: string, result: any) {
  const key = query.toLowerCase().trim();
  if (searchCache.size >= MAX_CACHE) {
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }
  searchCache.set(key, result);
}

// ============================
// FULL SEARCH (Roadmap + Resources + Tools)
// ============================
export function fullSearch(query: string) {
  const cached = getCachedSearch(query);
  if (cached) return cached;
  
  const roadmap = generateRoadmap(query);
  const resources = getResourcesForDomain(roadmap.domainKey, query);
  const tools = getToolsForDomain(roadmap.domainKey);
  
  const result = {
    roadmap,
    resources,
    tools,
    timestamp: Date.now()
  };
  
  cacheSearch(query, result);
  return result;
}

// ============================
// GET INTERVIEW QUESTIONS FOR DOMAIN
// ============================
export function getInterviewDomainKey(domainKey: string) {
  const interviewDomainMap: Record<string, string> = {
    'python': 'general',
    'javascript': 'frontend_developer',
    'java': 'backend_developer',
    'react': 'frontend_developer',
    'nodejs': 'backend_developer',
    'data_science': 'data_scientist',
    'devops': 'backend_developer',
    'cloud': 'backend_developer',
    'cybersecurity': 'general',
    'ai_ml': 'data_scientist',
    'backend': 'backend_developer',
    'frontend': 'frontend_developer',
    'fullstack': 'backend_developer',
    'mobile': 'frontend_developer',
    'sql': 'backend_developer',
    'hr_manager': 'hr',
    'digital_marketing': 'digital_marketing',
    'product_manager': 'product_manager',
    'ui_ux_design': 'general',
    'content_writing': 'general',
    'business_analyst': 'general',
    'project_manager': 'product_manager',
    'upsc': 'general',
    'sales': 'general',
    'finance': 'general',
  };
  
  return interviewDomainMap[domainKey] || 'general';
}

// ============================
// CAREER PLANNER GENERATOR
// ============================
export function generateCareerPlan({ targetRole, currentLevel, timeAvailability, country, duration }: any) {
  const roadmap = generateRoadmap(targetRole);
  const totalStages = roadmap.stages.length;
  
  // Duration presets in months
  const durationMonths: Record<string, number> = {
    '3months': 3,
    '6months': 6,
    '12months': 12,
  };
  
  const months = durationMonths[duration] || 6;
  
  // Adjust stages based on current level
  let startStage = 0;
  if (currentLevel === 'intermediate') startStage = 1;
  if (currentLevel === 'advanced') startStage = 2;
  
  const activeStages = roadmap.stages.slice(startStage);
  const weeksPerStage = Math.floor((months * 4) / activeStages.length);
  
  // Adjust hours per week based on availability
  const hoursMap: Record<string, string> = {
    'part-time': '5-10 hours/week',
    'full-time': '20-30 hours/week',
    'dedicated': '40+ hours/week',
  };
  
  const plan = activeStages.map((stage: any, i: number) => ({
    ...stage,
    weekStart: i * weeksPerStage + 1,
    weekEnd: (i + 1) * weeksPerStage,
    monthLabel: `Month ${Math.floor((i * weeksPerStage) / 4) + 1}`,
    status: i === 0 ? 'current' : 'upcoming',
  }));
  
  return {
    role: roadmap.label,
    type: roadmap.type,
    domainKey: roadmap.domainKey,
    totalMonths: months,
    hoursPerWeek: hoursMap[timeAvailability] || hoursMap['part-time'],
    currentLevel,
    country: country || 'Global',
    plan,
    resources: getResourcesForDomain(roadmap.domainKey, targetRole),
    tools: getToolsForDomain(roadmap.domainKey),
  };
}

// ============================
// UTILITIES
// ============================
function capitalize(str: string) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

// ============================
// POPULAR SEARCHES (for suggestions)
// ============================
export const popularSearches = [
  'Python', 'JavaScript', 'React', 'Data Science', 'DevOps',
  'Digital Marketing', 'UI/UX Design', 'Product Manager',
  'Backend Developer', 'Frontend Developer', 'Full Stack',
  'Cloud Engineer', 'Cybersecurity', 'AI/ML Engineer',
  'HR Manager', 'Content Writing', 'Business Analyst',
  'Mobile Developer', 'Java', 'Node.js', 'SQL',
  'Project Manager', 'UPSC', 'Sales', 'Finance'
];
