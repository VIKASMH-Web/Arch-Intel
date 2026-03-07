'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Globe, Terminal, AlertTriangle, CheckCircle, Info, Zap, Github, Brain, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeAuditorPage = () => {
  const [prDiff, setPrDiff] = useState(`--- a/api/v1/users/controller.ts
+++ b/api/v1/users/controller.ts
@@ -10,6 +10,12 @@
-  @Get('/')
-  async getUsers() {
+  @Get('/')
+  async getUsers() {
+    var userList = await db.users.find();
+    console.log(userList);
+    return userList;
+  }`);

  const [isLocalOnly, setIsLocalOnly] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleAudit = async () => {
    setIsAnalyzing(true);
    setResults([]);
    
    // Simulate Local Inference Latency
    setTimeout(() => {
      const findings = [
        {
          severity: "Critical",
          line_number: 13,
          issue: "Forbidden keyword 'var' used. Violates .styleguide Team Standards.",
          suggestion: "const userList = await db.users.find();"
        },
        {
          severity: "Warning",
          line_number: 11,
          issue: "Missing intent-based decorators for /api/v1 route. Requires @Authenticated.",
          suggestion: "@Authenticated()\n@Get('/')"
        },
        {
          severity: "Nitpick",
          line_number: 14,
          issue: "Incorrect logging pattern. Prints to console instead of Winston.",
          suggestion: "log.info(userList);"
        }
      ];
      setResults(findings);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-2xl text-white shadow-xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Automated <span className="text-primary">Code Auditor</span></h1>
            <p className="text-muted text-sm font-medium italic mt-1">Sovereign PR Analysis & Standards Enforcement</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-surface p-2 rounded-2xl border border-border">
          <button 
            onClick={() => setIsLocalOnly(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isLocalOnly ? 'bg-primary text-white shadow-md' : 'text-muted'}`}
          >
            <Lock size={14} /> Local Solo
          </button>
          <button 
            onClick={() => setIsLocalOnly(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${!isLocalOnly ? 'bg-indigo-600 text-white shadow-md' : 'text-muted'}`}
          >
            <Globe size={14} /> Cloud Audit
          </button>
        </div>
      </header>

      {/* CORE FEATURES INFO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="standard-card p-6 flex flex-col gap-3 bg-white border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-blue-600">
            <Github size={18} />
            <h3 className="font-bold uppercase text-xs tracking-wider">Team Standards</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">Compares diff against .styleguide. Flags var, deprecated libs, and log patterns.</p>
        </div>
        <div className="standard-card p-6 flex flex-col gap-3 bg-white border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <Brain size={18} />
            <h3 className="font-bold uppercase text-xs tracking-wider">Intent Security</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">Identifies missing decorators (@Authenticated, @RateLimited) for sensitive routes.</p>
        </div>
        <div className="standard-card p-6 flex flex-col gap-3 bg-white border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 text-amber-600">
            <Zap size={18} />
            <h3 className="font-bold uppercase text-xs tracking-wider">Noise Filter</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">Automatically handles minor syntax & naming fixes so reviewers stay focused.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INPUT: PR DIFF */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col flex-1 min-h-[500px]">
            <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-primary" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest font-mono">Input: PR_DIFF_CHUNK</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
            </div>
            <textarea
              value={prDiff}
              onChange={(e) => setPrDiff(e.target.value)}
              className="flex-1 bg-transparent p-6 font-mono text-sm text-emerald-100 focus:outline-none resize-none custom-scrollbar leading-relaxed"
              placeholder="Paste your git diff here..."
            />
            <div className="p-6 bg-slate-800/50 border-t border-white/5">
              <button 
                onClick={handleAudit}
                disabled={isAnalyzing}
                className="w-full bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? <RotateCcw size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                {isAnalyzing ? 'Analyzing Solo...' : 'Execute Local Audit'}
              </button>
            </div>
          </div>
        </div>

        {/* OUTPUT: AUDIT RESULTS */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Audit <span className="text-primary">Results</span></h3>
            {isLocalOnly && (
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Zero-Egress Mode Active</span>
               </div>
            )}
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {results.length === 0 && !isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                  <ShieldCheck size={64} className="mb-4" />
                  <p className="font-black uppercase tracking-[0.2em] text-[10px]">No issues detected yet</p>
                </motion.div>
              )}
              
              {isAnalyzing && (
                <div className="flex flex-col gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-surface animate-pulse rounded-3xl border border-border" />
                  ))}
                </div>
              )}

              {results.map((res, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="standard-card p-6 bg-white flex flex-col gap-4 border-slate-100 shadow-md group hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        res.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                        res.severity === 'Warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {res.severity}
                      </span>
                      <span className="text-[10px] font-bold text-muted uppercase">Line {res.line_number}</span>
                    </div>
                    {res.severity === 'Critical' ? <AlertTriangle size={16} className="text-red-500" /> : <Info size={16} className="text-blue-500" />}
                  </div>
                  
                  <p className="text-sm font-bold text-foreground leading-relaxed">{res.issue}</p>
                  
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 font-mono text-[11px] relative">
                    <span className="absolute -top-2 left-4 px-2 bg-white border border-slate-100 rounded-md text-[8px] font-black uppercase tracking-widest text-primary">Suggestion</span>
                    <pre className="text-emerald-700">{res.suggestion}</pre>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {results.length > 0 && (
            <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck size={80} />
               </div>
               <div className="relative z-10">
                 <h4 className="font-black uppercase text-xs tracking-widest mb-4">Operational Compliance</h4>
                 <ul className="text-[10px] font-medium space-y-2 opacity-80 uppercase tracking-wider">
                   <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400" /> GDPR Data Anonymization Active</li>
                   <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400" /> India DPDP Act Compliance Cleared</li>
                   <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400" /> Zero IP Egress Detected</li>
                 </ul>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* ECOSYSTEM CONFIGURATION */}
      <section className="bg-white border border-border rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <Settings size={20} className="text-primary" />
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Audit Ecosystem <span className="text-primary">Configuration</span></h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Neural Engine Settings</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono">ollama_host</span>
                  <span className="text-[10px] text-muted uppercase">http://localhost:11434</span>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black">ACTIVE</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono">active_model</span>
                  <span className="text-[10px] text-muted uppercase">llama3-8b-instruct</span>
                </div>
                <button className="text-[10px] font-black text-primary hover:underline uppercase">Switch</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">CI/CD WebHook integration</h4>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Github size={20} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold font-mono">github_webhook_active</span>
                    <span className="text-[10px] text-slate-500 uppercase">Listening for :pull_request</span>
                  </div>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <button className="w-full border border-dashed border-border p-4 rounded-2xl text-[10px] font-black text-muted hover:text-primary hover:border-primary/50 transition-all uppercase tracking-widest">
                + Add WebHook (GitLab/BitBucket)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const RotateCcw = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
);

export default CodeAuditorPage;
