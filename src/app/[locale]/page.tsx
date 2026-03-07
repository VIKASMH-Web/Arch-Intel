"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { TrendingUp, CheckCircle2, Award, Zap, Calculator, Brain, Globe, RotateCcw, Code2, Layers, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const common = useTranslations('Common');

  const [contests, setContests] = React.useState<any[]>([]);
  const [loadingContests, setLoadingContests] = React.useState(true);
  const [roadmapProgress, setRoadmapProgress] = React.useState(75);
  const [targetRole, setTargetRole] = React.useState('AWS SA Professional');

  React.useEffect(() => {
    // Load local roadmap progress
    const savedMods = localStorage.getItem('roadmap-completed-mods');
    const savedSteps = localStorage.getItem('roadmap-steps');
    const savedSkills = localStorage.getItem('roadmap-skills');

    if (savedMods && savedSteps) {
      try {
        const mods = JSON.parse(savedMods);
        const steps = JSON.parse(savedSteps);
        const total = steps.reduce((acc: number, s: any) => acc + (s.modules?.length || 0), 0);
        if (total > 0) setRoadmapProgress(Math.round((mods.length / total) * 100));
        
        if (savedSkills) {
          const skillsList = JSON.parse(savedSkills);
          if (skillsList.length > 0) setTargetRole(`${skillsList[0]} Architect`);
        }
      } catch (e) {
        console.error("Local storage sync error", e);
      }
    }

    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        setContests(data);
        setLoadingContests(false);
      })
      .catch(() => setLoadingContests(false));
  }, []);

  const stats = [
    { label: t('progress'), value: '42%', icon: CheckCircle2, detail: '18 modules completed' },
    { label: 'Level', value: 'Explorer', icon: Award, detail: '+25% from last week' },
    { label: t('milestone'), value: 'AWS Pro Architect', icon: Zap, detail: 'Expected in 3 weeks' },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">{t('welcome')}</h2>
        <p className="text-muted text-lg">{t('ready')}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="standard-card p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted">{stat.label}</span>
                <Icon size={18} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-green-600 font-medium">
                  {stat.detail}
                </span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: idx === 0 ? '42%' : '65%' }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Arch Intelligence Card */}
        <div className="standard-card p-8 flex flex-col gap-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100/50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Brain size={24} className="animate-pulse" />
            <h3 className="text-xl font-bold">{common('archIntelligence')}</h3>
          </div>
          <p className="text-muted leading-relaxed">
            Upload your codebase and let the Architect-AI mentor you through the logic. Get deep architectural insights and Socratic mentoring.
          </p>
          <div className="flex items-center gap-4 bg-white/80 p-6 rounded-xl border border-indigo-100 shadow-sm mt-auto">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-muted uppercase font-semibold">{t('aiStatus')}</span>
              <span className="text-lg font-bold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t('readyForAnalysis')}
              </span>
            </div>
            <Zap size={32} className="text-indigo-400 opacity-50" />
          </div>
          <Link href="/arch-intel">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 text-sm self-start">
              Open Arch-Intel
            </button>
          </Link>
        </div>

        {/* Global Challenges (KONTESTS) */}
        <div className="standard-card p-8 flex flex-col gap-6 bg-gradient-to-br from-slate-50 to-white border-slate-100 shadow-sm relative overflow-hidden group">
          {/* Decorative background icon */}
          <div className="absolute -right-6 -top-6 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Globe size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                   <TrendingUp size={22} />
                 </div>
                 <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-800">Global <span className="text-primary">Challenges</span></h3>
               </div>
               <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full animate-pulse border border-orange-200 uppercase tracking-widest">LIVE DATA</span>
            </div>
            
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 flex-1 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar shadow-inner">
              {loadingContests ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                   <div className="relative">
                      <RotateCcw className="animate-spin text-primary" size={32} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                         <Globe size={14} className="animate-pulse" />
                      </div>
                   </div>
                   <div className="flex flex-col items-center text-center gap-1">
                      <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-slate-800">Syncing Global Data...</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase italic">Please wait, connecting to global contest engines</span>
                   </div>
                </div>
              ) : contests.length > 0 ? (
                contests.map((contest: any, i: number) => {
                  const site = contest.site?.toLowerCase() || '';
                  let platformColor = 'text-slate-400';
                  let platformBg = 'bg-slate-100';
                  let logoUrl = '';
                  
                  if (site.includes('leetcode')) { 
                    platformColor = 'text-orange-500'; 
                    platformBg = 'bg-orange-50';
                    logoUrl = 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/leet-code.svg';
                  }
                  else if (site.includes('codeforces')) { 
                    platformColor = 'text-blue-500'; 
                    platformBg = 'bg-blue-50';
                    logoUrl = 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/codeforces.svg';
                  }
                  else if (site.includes('codechef')) { 
                    platformColor = 'text-[#5B4638]'; 
                    platformBg = 'bg-[#F7F1EE]';
                    logoUrl = 'https://cdn.simpleicons.org/codechef';
                  }
                  else if (site.includes('hackerrank')) { 
                    platformColor = 'text-emerald-500'; 
                    platformBg = 'bg-emerald-50';
                    logoUrl = 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/hackerrank.svg';
                  }

                  return (
                    <a 
                      key={i} 
                      href={contest.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all group/item"
                    >
                      <div className={`w-10 h-10 rounded-lg ${platformBg} flex items-center justify-center p-2 flex-shrink-0 shadow-sm border border-transparent group-hover/item:border-current/10 transition-colors`}>
                        {logoUrl ? (
                          <img src={logoUrl} alt={contest.site} className="w-full h-full object-contain" />
                        ) : (
                          <Globe size={18} className={platformColor} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${platformColor}`}>{contest.site}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Starts {new Date(contest.start_time).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-700 truncate group-hover/item:text-primary transition-colors mt-0.5">
                          {contest.name}
                        </h4>
                      </div>
                      
                      <ArrowRight size={14} className="text-slate-300 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all flex-shrink-0" />
                    </a>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-10 opacity-50">
                   <Globe size={24} />
                   <span className="text-[10px] font-black uppercase tracking-widest">No active challenges found</span>
                </div>
              )}
            </div>
            <p className="text-[9px] text-slate-400 mt-4 italic font-medium flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Real-time feed active • Synced {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </section>
      
      {/* Financial Impact Preview */}
      <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="standard-card p-8 flex flex-col gap-6 bg-gradient-to-br from-white to-orange-50/50">
          <div className="flex items-center gap-2 text-primary">
            <Calculator size={24} />
            <h3 className="text-xl font-bold">{t('salaryPotential')}</h3>
          </div>
          <p className="text-muted leading-relaxed">
            {t('earningPotential')}
          </p>
          <div className="flex items-center gap-4 bg-white/80 p-6 rounded-xl border border-orange-100 shadow-sm max-w-md">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-muted uppercase font-semibold">Projected Salary Growth</span>
              <span className="text-3xl font-bold text-foreground">₹28.4 LPA <span className="text-sm font-normal text-muted">avg</span></span>
            </div>
            <TrendingUp size={32} className="text-green-500 animate-pulse" />
          </div>
          <Link href="/simulator">
            <button className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 text-sm self-start">
              Explore Simulator
            </button>
          </Link>
        </div>

        {/* Next Target / Career Roadmap Milestone */}
        <Link href="/roadmaps" className="block transition-transform hover:scale-[1.01] active:scale-[0.99] h-full">
          <div className="standard-card p-8 bg-white relative overflow-hidden group h-full cursor-pointer border border-border hover:border-primary/50 transition-all shadow-xl">
            <div className="relative z-10 h-full flex flex-col justify-between" style={{ color: '#000000' }}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#666666' }}>Next Target</span>
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors" style={{ color: '#000000' }}>AWS SA Professional</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-200 shadow-sm">
                  <Award size={20} className="text-primary" />
                </div>
              </div>
              
              <div className="mt-8 flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                    <circle 
                      cx="80" cy="80" r="72" 
                      fill="transparent" 
                      stroke="#f1f5f9" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="80" cy="80" r="72" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="10"
                      strokeDasharray={452}
                      strokeDashoffset={452 * (1 - 0.75)}
                      className="text-primary transition-all duration-1000 ease-out fill-transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
                    <span className="text-3xl font-black" style={{ color: '#000000' }}>75%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#666666' }}>Mastery</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#047857' }}>Estimated: 45 days remaining</span>
                   </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: '#666666' }}>
                   <span>Advanced Architecting</span>
                   <span>3/4 Modules</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-slate-100'} shadow-sm`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}

