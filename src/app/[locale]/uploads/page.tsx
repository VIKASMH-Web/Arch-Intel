'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Upload, FileCode, Search, Filter, MoreVertical, ExternalLink, Calendar, Code, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

const UploadsPage = () => {
    const common = useTranslations('Common');
  
    const files = [
      { name: 'payment-gateway-lambda', lang: 'TypeScript', date: 'Oct 24, 2024', size: '1.2 MB', status: 'Analyzed', complexity: 'Medium' },
      { name: 'data-ingestion-pipeline', lang: 'Python', date: 'Nov 02, 2024', size: '4.5 MB', status: 'Analyzed', complexity: 'High' },
      { name: 'user-auth-service', lang: 'Go', date: 'Dec 15, 2024', size: '800 KB', status: 'Pending', complexity: 'Low' },
      { name: 'inventory-system', lang: 'Java', date: 'Jan 10, 2025', size: '12 MB', status: 'Analyzed', complexity: 'High' },
    ];
  
    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Upload className="text-primary" size={40} />
              My Uploaded Codebases
              </h1>
              <p className="text-muted text-lg">Manage and revisit your analyzed architectural snapshots.</p>
          </div>
          <Link href="/arch-intel">
            <button className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2">
                <Upload size={18} />
                Analyze New Repo
            </button>
          </Link>
        </header>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Search your repositories..."
                className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
            />
        </div>
        <button className="flex items-center gap-2 bg-white border border-border px-4 py-3 rounded-xl hover:bg-surface transition-all text-sm font-bold text-muted">
            <Filter size={16} />
            Filter
        </button>
      </div>

      <div className="standard-card overflow-hidden bg-white shadow-xl ring-1 ring-black/5 border-none">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-surface/50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted">Repository Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted">Language</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted">Complexity</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
                {files.map((file, idx) => (
                    <tr key={idx} className="hover:bg-surface/30 transition-colors group">
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg border border-border shadow-sm group-hover:border-primary/30 transition-colors">
                                    <FileCode size={20} className="text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground leading-tight">{file.name}</span>
                                    <span className="text-[10px] text-muted font-medium uppercase tracking-tight">{file.size}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                                {file.lang === 'TypeScript' && < Globe size={14} className="text-blue-500" />}
                                {file.lang === 'Python' && < Code size={14} className="text-green-500" />}
                                {file.lang === 'Go' && < Database size={14} className="text-cyan-500" />}
                                {file.lang === 'Java' && < Code size={14} className="text-red-500" />}
                                {file.lang}
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                file.status === 'Analyzed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700 animate-pulse'
                            }`}>
                                {file.status}
                            </span>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div 
                                        key={i} 
                                        className={`h-1 w-4 rounded-full ${
                                            file.complexity === 'Low' && i === 1 ? 'bg-green-400' :
                                            file.complexity === 'Medium' && i <= 2 ? 'bg-orange-400' :
                                            file.complexity === 'High' ? 'bg-red-400' : 'bg-gray-200'
                                        }`} 
                                    />
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/arch-intel?repo=${file.name}`}>
                                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border transition-all text-muted hover:text-primary" title="Details">
                                        <ExternalLink size={16} />
                                    </button>
                                </Link>
                                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border transition-all text-muted">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <div className="p-4 bg-surface/30 border-t border-border flex items-center justify-center">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Showing {files.length} Codebases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="standard-card p-6 bg-orange-50/50 border-orange-100 flex gap-4 items-start">
            <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                <Code size={24} />
            </div>
            <div className="space-y-1">
                <h4 className="font-bold text-orange-900">Code Parser v2.4 (Active)</h4>
                <p className="text-xs text-orange-800/80 leading-relaxed">
                    Our latest parser supports multi-file dependency analysis. Make sure to upload the entire `src` folder for deep architectural insights.
                </p>
            </div>
        </div>
        <div className="standard-card p-6 bg-blue-50/50 border-blue-100 flex gap-4 items-start">
            <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                <Database size={24} />
            </div>
            <div className="space-y-1">
                <h4 className="font-bold text-blue-900">S3 Storage Retention</h4>
                <p className="text-xs text-blue-800/80 leading-relaxed">
                    Analyzing codebases are stored for 30 days. You can download existing Logic Diagrams from the details view anytime.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UploadsPage;
