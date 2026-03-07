'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Lock, EyeOff, Github, CheckCircle2, AlertTriangle, Cpu, Globe, Zap, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityPage = () => {
  const t = useTranslations('Security');
  const [privateMode, setPrivateMode] = useState(true);
  const [gitConnected, setGitConnected] = useState(true);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Shield className="text-primary" size={40} />
          {t('title')}
        </h1>
        <p className="text-muted text-lg">Enterprise-grade privacy and seamless Git workflow integration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Privacy First Section */}
        <div className="standard-card p-8 bg-white flex flex-col gap-6 border-2 border-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary">
              <Lock size={24} />
              <h3 className="text-xl font-bold">{t('mode')}</h3>
            </div>
            <button 
              onClick={() => setPrivateMode(!privateMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${privateMode ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${privateMode ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
          
          <div className="p-4 bg-surface rounded-xl border border-border/50">
            <p className="text-sm text-foreground font-medium">{t('modeDesc')}</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Server size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Local reasoning (Llama 3 / Ollama)</h4>
                <p className="text-xs text-muted mt-0.5">When enabled, AI inference happens on your local workstation or private VPC node.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <EyeOff size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Zero Data Training Policy</h4>
                <p className="text-xs text-muted mt-0.5">Your code is never used to train global models. Amazon Bedrock ensures data isolation.</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Compliance Status</span>
            <span className="badge badge-beginner bg-green-100 text-green-700 px-3">SOC2 Ready</span>
          </div>
        </div>

        {/* Git Integration Section */}
        <div className="standard-card p-8 bg-white flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-foreground">
              <Github size={24} />
              <h3 className="text-xl font-bold">Git Integration</h3>
            </div>
            <span className={`badge ${gitConnected ? 'badge-beginner' : 'badge-intermediate'} px-3 py-1`}>
              {gitConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="p-6 bg-foreground text-white rounded-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Zap size={18} className="text-primary fill-primary" />
                Local-Compatibility Check
              </h4>
              <p className="text-xs text-white/70 mt-1">Automated AI review for every PR.</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" />
                    Clean Architecture
                  </span>
                  <span className="font-bold">PASS</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" />
                    Least Privilege (IAM)
                  </span>
                  <span className="font-bold">PASS</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-red-400/20 p-2.5 rounded-lg border border-red-400/30">
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-400" />
                    Naming Standards
                  </span>
                  <span className="font-bold text-red-400">FAILED (3)</span>
                </div>
              </div>
            </div>
            {/* Decorative background logo */}
            <Github size={120} className="absolute -bottom-10 -right-10 text-white opacity-5 rotate-12" />
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-3 rounded-xl border-2 border-border font-bold text-sm hover:bg-surface transition-all flex items-center justify-center gap-2">
              <Github size={18} />
              Configure Webhooks
            </button>
            <p className="text-[10px] text-center text-muted">
              AI checks run locally before code is committed to the remote repository.
            </p>
          </div>
        </div>
      </div>

      {/* Indian Tier-2/3 Adoption Note */}
      <section className="bg-blue-50/50 border border-blue-100 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
        <div className="p-6 bg-white rounded-2xl shadow-sm text-blue-600">
          <Globe size={48} />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-xl font-bold text-blue-900">Bharat-Ready Privacy Architecture</h4>
          <p className="text-sm text-blue-800/80 leading-relaxed">
            We understand the data sovereignty requirements of Indian enterprises. Our **Privacy-First** engine allows you to host all AI analytical models within the Mumbai region (ap-south-1) or entirely on your local infrastructure. **Arch-Intelligence** is designed for rural accessibility—optimized for low-bandwidth environments while maintaining maximum security.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white border border-blue-200 rounded-full text-blue-700">Digital India Compliant</span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white border border-blue-200 rounded-full text-blue-700">ISO 27001 Ready</span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white border border-blue-200 rounded-full text-blue-700">MEA Data Protocol</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
