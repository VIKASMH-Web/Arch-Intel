'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Plus, Trash2, CheckCircle2, Circle, Menu, ExternalLink, Zap, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoadmapPage = () => {
  const t = useTranslations('Roadmap');
  const locale = useLocale();
  const [inputValue, setInputValue] = useState('');
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [steps, setSteps] = useState([
    { title: 'Foundations & Architecture', description: 'Grasp the core principles of cloud infrastructure and high availability.', modules: ['VPC Peering', 'IAM Roles', 'S3 Architecture'], certs: 'Cloud Practitioner', status: 'completed', importance: 'core', estimated_weeks: 2 },
    { title: 'Scalable Systems', description: 'Design systems that automatically handle traffic spikes with surgical precision.', modules: ['Auto Scaling', 'ALB/NLB', 'Event-Bridge'], certs: 'Associate Architect', status: 'in-progress', importance: 'core', estimated_weeks: 3 },
    { title: 'Zero-Trust Security', description: 'Implement mandatory safety patterns and architectural guardrails.', modules: ['WAF Rules', 'KMS Encryption', 'VPC Flow Logs'], certs: 'Security Specialty', status: 'todo', importance: 'advanced', estimated_weeks: 4 },
  ]);


  // Persistence: Load from localStorage
  React.useEffect(() => {
    const savedSteps = localStorage.getItem('roadmap-steps');
    const savedMods = localStorage.getItem('roadmap-completed-mods');

    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
      setShowRoadmap(true);
    } else {
      // Initially generate Frontend Developer roadmap
      handleGenerate('Frontend Developer');
    }
    if (savedMods) setCompletedModules(JSON.parse(savedMods));
  }, []);


  React.useEffect(() => {
    localStorage.setItem('roadmap-steps', JSON.stringify(steps));
  }, [steps]);

  React.useEffect(() => {
    localStorage.setItem('roadmap-completed-mods', JSON.stringify(completedModules));
  }, [completedModules]);

  /* ─── Roadmap Node Details Panel ─── */
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const toggleModule = (mod: string) => {
    setCompletedModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };


  const [roadmapLabel, setRoadmapLabel] = useState('Career Roadmap');
  const [resources, setResources] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const masterSuggestions = [
    // A
    'Android Developer', 'AWS Cloud Architect', 'AWS Solutions Architect', 'AWS DevOps Engineer',
    'AI Engineer', 'Angular Developer', 'API Developer', 'Azure Cloud Engineer',
    // B
    'Backend Developer', 'Blockchain Developer', 'Business Analyst', 'Big Data Engineer',
    // C
    'Cloud Security Engineer', 'Cloud Architect', 'Cloud DevOps', 'C++ Developer', 
    'Cybersecurity Analyst', 'Computer Vision Engineer',
    // D
    'Data Scientist', 'Data Analyst', 'Data Engineer', 'DevOps Specialist', 
    'Django Developer', 'Database Admin', 'Deep Learning Engineer',
    // E
    'Embedded Systems Engineer', 'ETL Developer', 'Ethical Hacker',
    // F
    'Frontend Developer', 'Flutter Developer', 'Full Stack Developer', 'Firebase Developer',
    // G
    'Game Developer', 'Go Developer', 'GraphQL Developer', 'GCP Architect',
    // H
    'Hadoop Engineer', 'HTML/CSS Developer', 'HPC Engineer',
    // I
    'iOS Developer', 'Infrastructure Engineer', 'Information Security',
    // J
    'Java Developer', 'JavaScript Developer', 'Jenkins CI/CD',
    // K
    'Kotlin Developer', 'Kubernetes Expert', 'Kafka Engineer', 'Keras AI Engineer',
    // L
    'Linux Administrator', 'LLM Engineer', 'Laravel Developer',
    // M
    'Machine Learning Engineer', 'MERN Stack Developer', 'Mobile App Developer', 'MongoDB Developer',
    // N
    'Node.js Developer', 'NLP Engineer', 'Network Engineer', 'Next.js Developer',
    // O
    'Open Source Contributor', 'Oracle DBA',
    // P
    'Python Developer', 'Python Data Science', 'Product Manager', 'PHP Developer', 
    'PowerBI Analyst', 'Prompt Engineer', 'Platform Engineer',
    // Q
    'QA Engineer', 'Quantum Computing',
    // R
    'React Developer', 'Rust Developer', 'Ruby on Rails', 'RPA Developer', 'R Data Analyst',
    // S
    'Spring Boot Developer', 'Solidity Developer', 'Site Reliability Engineer', 
    'Swift Developer', 'SQL Developer', 'Solutions Architect', 'System Administrator',
    // T
    'TypeScript Developer', 'Terraform Engineer', 'Tech Lead', 'TensorFlow Engineer',
    // U
    'UI/UX Designer', 'Unity Game Dev', 'Unix Administrator',
    // V
    'Vue.js Developer', 'VR/AR Developer',
    // W
    'Web Developer', 'WordPress Developer',
    // X-Z
    'Xamarin Developer', 'YAML DevOps', 'Zig Developer'
  ];

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const inputWords = val.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    // Score each suggestion by how many input words it matches
    const scored = masterSuggestions.map(s => {
      const sLower = s.toLowerCase();
      let score = 0;
      if (inputWords.length === 0) {
        score = 1; // Show all if empty
      } else {
        for (const word of inputWords) {
          if (sLower.includes(word)) score++;
        }
      }
      return { text: s, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30); // Show more suggestions

    setSuggestions(scored.map(s => s.text));
    setShowSuggestions(true);
  };

  const handleGenerate = async (queryOverride?: string) => {
    setIsGenerating(true);
    setShowSuggestions(false);
    try {
      const query = queryOverride || inputValue;
      const response = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: Array.isArray(query) ? query : [query], locale })
      });
      const data = await response.json();
      if (data.steps) {
        // Ensure every step has a modules array to prevent crashes
        const sanitizedSteps = data.steps.map((s: any) => ({
          ...s,
          modules: Array.isArray(s.modules) ? s.modules : [(s.description || 'Learn more')]
        }));
        setSteps(sanitizedSteps);
        setResources(data.resources || []);
        setTools(data.tools || []);
        setRoadmapLabel(data.label || 'Career Roadmap');
        setShowRoadmap(true);
      }
    } catch (e) {
      console.error("Roadmap Generation Failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalModules = steps.reduce((acc, s) => acc + (s.modules?.length || 0), 0);
  const progress = Math.round((completedModules.length / totalModules) * 100) || 0;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-20 relative">
      
      {/* ─── HEADER ─── */}
      <header className="flex flex-row items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Award size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic">
              Skill <span className="text-primary">Path</span>
            </h1>
          </div>
          <p className="text-muted font-bold text-[10px] uppercase tracking-[0.2em] opacity-60 ml-1">
            {t('subtitle') || 'AI-Architected Learning Journey'}
          </p>
        </div>
        {progress > 0 && totalModules > 0 && (
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden border border-border/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-primary to-orange-500"
                />
              </div>
              <span className="text-xs font-black text-primary">{progress}%</span>
            </div>
            <span className="text-[10px] text-muted font-black uppercase tracking-tighter">Your Mastery Progress</span>
          </div>
        )}
      </header>

      {/* ─── SKILL INPUT ─── */}
      <div className="bg-white border-2 border-border/60 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Zap size={140} />
        </div>
        
        <div className="relative z-10 space-y-6">

          <div className="flex gap-3 relative">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => handleInputChange(inputValue)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Enter a job title or skill (e.g. Cloud Architect)..."
                className="w-full bg-surface border-2 border-border/40 rounded-2xl pl-14 pr-4 py-4 focus:outline-none focus:border-primary/40 focus:bg-white transition-all font-black text-sm tracking-tight placeholder:text-muted/30"
              />

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute inset-x-0 top-full mt-2 bg-white border-2 border-border/60 rounded-2xl shadow-2xl z-[150] overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
                  >
                    <div className="p-2">
                      <div className="px-3 py-1 text-[8px] font-black text-muted uppercase tracking-widest border-b border-border/40 mb-1 flex items-center justify-between">
                        <span>Online Search Suggestions</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-emerald-600">Live</span>
                        </div>
                      </div>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInputValue(s);
                            handleGenerate(s);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-surface rounded-xl flex items-center gap-3 transition-colors group/item"
                        >
                          <Search size={14} className="text-muted group-hover/item:text-primary transition-colors" />
                          <span className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">
                            {s.split(new RegExp(`(${escapeRegExp(inputValue)})`, 'gi')).map((part, idx) => (
                              part.toLowerCase() === inputValue.toLowerCase() ? 
                                <span key={idx} className="text-primary underline decoration-2 underline-offset-4">{part}</span> : part
                            ))}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => handleGenerate()}
              disabled={isGenerating || !inputValue.trim()}
              className="px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-95 disabled:grayscale"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gen...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap size={14} fill="currentColor" />
                  <span>{t('generate')}</span>
                </div>
              )}
            </button>
          </div>

          {/* Popular Suggestions */}
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted mr-2">Quick Start:</span>
            {['Frontend', 'Backend', 'Data Science', 'Cloud Engineer', 'DevOps', 'AI Developer'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInputValue(suggestion);
                  handleGenerate(suggestion);
                }}
                className="px-3 py-1.5 bg-white border border-border/60 rounded-full text-[10px] font-bold text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ROADMAP PATH (ROADMAP.SH STYLE) ─── */}
      <AnimatePresence>
        {showRoadmap && (
          <div className="relative mt-10 p-10 bg-white border-2 border-border/40 rounded-[3rem] shadow-inner overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Center Line */}

            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-orange-500 to-gray-200 -translate-x-1/2 rounded-full hidden md:block" />

            <div className="space-y-24 relative z-10">
              {steps.map((step, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Node Content */}
                    <div className="flex-1 w-full max-w-[450px]">
                      <div 
                        onClick={() => setSelectedNode(step)}
                        className={`group relative bg-white border-2 p-6 rounded-[2rem] shadow-xl transition-all cursor-pointer overflow-hidden ${
                          selectedNode?.title === step.title ? 'border-primary ring-4 ring-primary/5' : 'border-border/40 hover:border-primary/20'
                        }`}
                      >
                        <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${
                          step.status === 'completed' ? 'from-green-400 to-emerald-600' :
                          step.status === 'in-progress' ? 'from-primary to-orange-500' :
                          'from-gray-200 to-gray-300'
                        }`} />
                        
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Phase {idx + 1}</span>
                          {(step as any).importance === 'advanced' && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[8px] font-black rounded uppercase">Advanced</span>
                          )}
                        </div>
                        
                        <h4 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{step.title}</h4>
                        <p className="text-xs text-muted font-medium mt-1 line-clamp-2">{(step as any).description || 'Master the core concepts and building blocks of this phase.'}</p>
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted">
                            <Plus size={10} /> {step.modules?.length || 0} Modules
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted">
                            <Plus size={10} /> {(step as any).estimated_weeks || 1} Weeks
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Central Indicator Node */}
                    <div className="relative flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full border-[6px] border-white shadow-xl z-20 flex items-center justify-center transition-all ${
                        step.status === 'completed' ? 'bg-emerald-500' :
                        step.status === 'in-progress' ? 'bg-primary' :
                        'bg-gray-200'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="text-white" size={20} /> : <Circle className="text-white/40" size={20} />}
                      </div>
                      {/* Horizontal connecting line (hidden on mobile) */}
                      <div className={`absolute h-0.5 bg-border/40 w-12 hidden md:block ${isLeft ? 'left-12' : 'right-12'}`} />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── NODE DETAILS SIDEBAR (POPUP) ─── */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-border p-10 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">PHASE CONTENT</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[8px] font-bold rounded uppercase">
                      {(selectedNode as any).estimated_weeks} WEEKS
                    </span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-foreground">{selectedNode.title}</h3>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                   <h5 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Required Knowledge</h5>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedNode.modules.map((mod: string) => {
                        const isDone = completedModules.includes(mod);
                        return (
                          <button 
                            key={mod}
                            onClick={() => toggleModule(mod)}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                              isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-surface border-border/40 hover:border-primary/20'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'
                            }`}>
                              {isDone && <CheckCircle2 size={12} />}
                            </div>
                            <span className={`text-xs font-bold leading-tight ${isDone ? 'text-emerald-800' : 'text-foreground'}`}>{mod}</span>
                          </button>
                        );
                      })}
                   </div>
                </div>

                {/* Learning Resources */}
                {resources.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Learning Resources</h5>
                    <div className="space-y-3">
                      {resources.slice(0, 3).map((res, i) => (
                        <a 
                          key={i} 
                          href={res.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-md transition-all group"
                        >
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-primary uppercase">{res.source}</span>
                            <span className="text-xs font-bold text-slate-800">{res.title}</span>
                          </div>
                          <ExternalLink size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mastery Tools */}
                {tools.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Mastery Tools</h5>
                    <div className="flex flex-wrap gap-2">
                       {tools.map((tool, i) => (
                         <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black uppercase border border-indigo-100 italic">
                           {tool.name}
                         </span>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER DISCLOSURE */}
      <div className="mt-10 py-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-muted font-bold italic max-w-2xl opacity-60">
          This architectural roadmap is dynamically architected using Amazon Bedrock Nova Lite. Each node is a logical step toward target stack mastery.
        </p>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
          <Zap size={10} className="text-emerald-600" />
          <span className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">
            AWS Cloud Live
          </span>
        </div>
      </div>
    </div>
  );
};


export default RoadmapPage;
