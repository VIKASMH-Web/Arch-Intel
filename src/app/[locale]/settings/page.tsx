'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Settings, User, Bell, Shield, Globe, Mail, MapPin, Save, Trash2, Camera, Cloud, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const common = useTranslations('Common');
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Settings className="text-primary" size={40} />
          Account Settings
        </h1>
        <p className="text-muted text-lg">Manage your personal information, security, and preferences.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 flex flex-row lg:flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                activeTab === tab.id 
                ? 'bg-primary text-white shadow-md' 
                : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Profile Card */}
              <div className="standard-card p-8 bg-white shadow-xl ring-1 ring-black/5 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                      VM
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-bold">Vikas MH</h3>
                    <p className="text-sm text-muted font-medium">Software Architect · Bangalore, India</p>
                    <div className="flex gap-2 mt-2">
                      <span className="badge badge-beginner px-2 py-0.5 text-[10px]">Cloud Pro</span>
                      <span className="badge bg-blue-50 text-blue-600 px-2 py-0.5 text-[10px]">Early Adopter</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input 
                        type="text" 
                        defaultValue="Vikas MH"
                        className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest px-1">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input 
                        type="email" 
                        defaultValue="vikas@example.com"
                        className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest px-1">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input 
                        type="text" 
                        defaultValue="Bangalore, India"
                        className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest px-1">Preferred Language</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <select className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-sm appearance-none">
                        <option>English (Global)</option>
                        <option>Kannada (ಕರ್ನಾಟಕ)</option>
                        <option>Hindi (भारत)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => alert('Changes discarded.')}
                    className="px-6 py-2.5 rounded-xl border border-border font-bold text-sm hover:bg-surface transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={() => alert('Settings saved successfully!')}
                    className="bg-primary hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Integrations */}
              <div className="standard-card p-8 bg-white flex flex-col gap-6">
                <h3 className="text-xl font-bold">App Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm">
                        <Github size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">GitHub Workspace</span>
                        <span className="text-[10px] text-muted font-semibold">Allow AI to read repository metadata.</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-green-600 border border-green-200 px-3 py-1 rounded-full bg-green-50">
                      Connected
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600">
                        <Cloud size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">AWS Organization</span>
                        <span className="text-[10px] text-muted font-semibold">Enable multi-account simulator insights.</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-primary border border-primary/20 px-3 py-1 rounded-full bg-orange-50">
                      Connect
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-red-100 pt-8 mt-12 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-bold text-red-600">Deactivate Account</span>
                    <span className="text-xs text-muted">This will permanently delete all your analyzed codebases and roadmap progress.</span>
                </div>
                <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm">
                    <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <div className="standard-card p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Shield size={40} />
              </div>
              <h3 className="text-xl font-bold">Security Preferences</h3>
              <p className="text-muted max-w-sm">Account-wide security settings, 2FA, and session management options will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
