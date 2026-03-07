'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, TrendingUp, Award, CheckCircle2, Circle, Clock, Zap, ChevronRight, Star, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressPage = () => {
  const common = useTranslations('Common');
  
  const skillBreakdown = [
    { name: 'AWS Cloud Architecture', progress: 65, level: 'Builder', color: 'bg-primary' },
    { name: 'DevOps & GitOps', progress: 42, level: 'Explorer', color: 'bg-blue-500' },
    { name: 'System Design', progress: 28, level: 'Beginner', color: 'bg-purple-500' },
    { name: 'IAC (Terraform/CDK)', progress: 85, level: 'Engineer', color: 'bg-green-500' },
  ];

  const recentMilestones = [
    { title: 'Serverless Design patterns', date: '2 days ago', icon: CheckCircle2, status: 'completed' },
    { title: 'Multi-region VPC Peering', date: '5 days ago', icon: CheckCircle2, status: 'completed' },
    { title: 'Kubernetes Cluster Setup', date: 'In Progress', icon: Clock, status: 'pending' },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <BarChart3 className="text-primary" size={40} />
          Your Progress Analytics
        </h1>
        <p className="text-muted text-lg">Detailed breakdown of your architecture and development journey.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="standard-card p-8 bg-white shadow-xl relative overflow-hidden ring-1 ring-black/5">
            <h3 className="text-xl font-bold mb-8">Skill Proficiency Breakdown</h3>
            <div className="space-y-8">
              {skillBreakdown.map((skill, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight">{skill.name}</span>
                      <span className="text-[10px] uppercase font-bold text-muted">{skill.level}</span>
                    </div>
                    <span className="font-bold text-primary">{skill.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${skill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="standard-card p-6 bg-white shadow-lg border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star size={20} className="text-primary" />
                </div>
                <h4 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">Next Target</h4>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-black text-black">AWS SA Professional</span>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700">Estimated: 45 days remaining</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                  <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(255,153,0,0.2)]" />
                </div>
              </div>
            </div>
            
            <div className="standard-card p-6 border-dashed border-2 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Clock size={20} />
                </div>
                <h4 className="font-bold">Commitment Rate</h4>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">4.2h</span>
                <span className="text-xs text-muted font-medium">Avg. daily focus</span>
              </div>
              <span className="text-[10px] text-green-600 font-bold uppercase mt-2">↑ 12% vs last week</span>
            </div>
          </div>
        </div>

        {/* Sidebar Milestones */}
        <div className="space-y-6">

        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
