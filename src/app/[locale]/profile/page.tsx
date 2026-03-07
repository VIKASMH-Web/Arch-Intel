'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Award, Edit2, Save, X, Mail, Calendar, MapPin, 
    Briefcase, Camera, Image, Plus, Trophy, Zap, Target, 
    Clock, Code, BookOpen, Trash2, LogOut, Star, Linkedin, 
    ExternalLink, ShieldCheck, CheckCircle, ChevronRight,
    Activity, Sparkles
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useGame } from '../context/GameContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, YAxis } from 'recharts';

const BADGE_DEFINITIONS = [
    { id: 'active_7', icon: '📅', title: '7 Active Days', desc: 'Consistency is power.', requirement: 7, unit: 'days', color: '#6366f1', getProgress: (ctx: any) => (ctx.activeDays || []).length },
    { id: 'code_warrior', icon: '⚔️', title: 'Code Warrior', desc: '25 analysis runs completed.', requirement: 25, unit: 'runs', color: '#10b981', getProgress: (ctx: any) => ctx.codeRuns || 0 },
    { id: 'focus_master', icon: '🧠', title: 'Focus Master', desc: '10 hours of deep work.', requirement: 600, unit: 'minutes', color: '#f59e0b', getProgress: (ctx: any) => ctx.focusMinutes || 0, formatProgress: (val: number) => `${(val / 60).toFixed(1)}h`, formatReq: () => '10h' },
    { id: 'halfway_hero', icon: '🏗️', title: 'Halfway Hero', desc: '50% roadmap completion.', requirement: 50, unit: '%', color: '#ec4899', getProgress: (ctx: any) => { try { let max = 0; const t = JSON.parse(localStorage.getItem('lc_domain_totals') || '{}'); Object.keys(t).forEach(d => { const s = ctx.getSkillLevel ? ctx.getSkillLevel(d) : { percentage: 0 }; if (s && s.percentage > max) max = s.percentage; }); return max; } catch { return 0; } } },
];

const ProfilePage = () => {
    const ctx = useProgress();
    const { activeDays = [], focusMinutes = 0, codeRuns = 0, badges = {}, dailyFocus = {}, interviewHistory = [] } = ctx || {};
    const { xp, streak } = useGame() || { xp: 0, streak: 0 };

    const [isEditing, setIsEditing] = useState(false);
    const [showSignOutWarning, setShowSignOutWarning] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const defaultProfile = {
        name: 'Vikas',
        title: 'Cloud Architect & Learner',
        location: 'Bengaluru, India',
        avatarUrl: null as string | null,
        bannerUrl: null as string | null,
        focusAreas: ['React', 'System Design', 'Algorithms'],
        experiences: [] as string[],
        certifications: [] as string[]
    };

    const storageKey = 'lc_profile_guest';
    const [profile, setProfile] = useState(defaultProfile);
    const [addItemType, setAddItemType] = useState<string | null>(null);
    const [itemInput, setItemInput] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                setProfile({ ...defaultProfile, ...parsed });
            }
        } catch (err) { console.error(err); }
    }, [storageKey]);

    useEffect(() => {
        if (profile.name) {
            localStorage.setItem(storageKey, JSON.stringify(profile));
        }
    }, [profile, storageKey]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfile(prev => ({ ...prev, [field]: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const performanceData = useMemo(() => {
        const data = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const trendBoost = (6 - i) * 15;
            const val = Math.max(30, Math.round((dailyFocus?.[dateStr] || 0) / 2 + 25 + trendBoost));
            data.push({ day: days[d.getDay()], score: val });
        }
        return data;
    }, [dailyFocus]);

    const handleAddItem = (type: string) => {
        if (!itemInput.trim()) return;
        setProfile((prev: any) => ({ ...prev, [type]: [...(prev[type] || []), itemInput] }));
        setItemInput('');
        setAddItemType(null);
    };

    const handleRemoveItem = (type: string, index: number) => {
        setProfile((prev: any) => ({ ...prev, [type]: prev[type].filter((_: any, i: number) => i !== index) }));
    };

    // Shared Premium Card Style
    const PremiumCard = ({ children, style = {}, noPadding = false }: { children: React.ReactNode, style?: React.CSSProperties, noPadding?: boolean }) => (
        <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '24px', 
            padding: noPadding ? 0 : '2rem', 
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            ...style 
        }}>
            {children}
        </div>
    );

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', background: '#F8FAFC',
        border: '1px solid #E2E8F0', borderRadius: '12px',
        color: '#1E293B', fontSize: '1rem', outline: 'none'
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem', background: '#F1F5F9', minHeight: '100vh', color: '#1E293B', fontFamily: "'Inter', sans-serif" }}>
            
            {/* 1. Header & Identity Section */}
            <header style={{ 
                background: '#FFFFFF', borderRadius: '32px', overflow: 'hidden', 
                border: '1px solid #E2E8F0', boxShadow: '0 15px 50px rgba(0,0,0,0.05)',
                marginBottom: '2.5rem'
            }}>
                {/* Banner */}
                <div 
                    onClick={() => isEditing && bannerInputRef.current?.click()}
                    style={{ 
                        height: '180px', position: 'relative', cursor: isEditing ? 'pointer' : 'default',
                        background: profile.bannerUrl ? `url(${profile.bannerUrl}) center/cover` : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #C026D3 100%)'
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    {isEditing && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                            <Camera size={24} style={{ marginRight: 12 }} /> Edit Banner
                        </div>
                    )}
                    <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'bannerUrl')} />
                </div>

                {/* Profile Info Overlay */}
                <div style={{ padding: '0 3.5rem 2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
                            <div style={{ position: 'relative', marginTop: '-60px' }}>
                                <div style={{ 
                                    width: 140, height: 140, borderRadius: '40px', background: '#FFFFFF',
                                    padding: '8px', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                    cursor: isEditing ? 'pointer' : 'default'
                                }} onClick={() => isEditing && avatarInputRef.current?.click()}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '28px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {profile.avatarUrl ? (
                                            <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <User size={60} color="#CBD5E1" />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#4F46E5', color: 'white', padding: 10, borderRadius: '50%', border: '4px solid white' }}>
                                            <Camera size={20} />
                                        </div>
                                    )}
                                </div>
                                <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
                            </div>

                            <div style={{ paddingBottom: '8px' }}>
                                {isEditing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{...inputStyle, fontSize: '2rem', fontWeight: 800, width: 350}} placeholder="Your Name" />
                                        <input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} style={{...inputStyle, width: 350}} placeholder="Your Expertise" />
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{profile.name}</h1>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4F46E5', fontWeight: 700, fontSize: '1.1rem' }}>
                                            <Sparkles size={18} /> {profile.title}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                                style={{ 
                                    padding: '12px 24px', borderRadius: '14px', border: 'none',
                                    background: isEditing ? '#0F172A' : '#4F46E5', color: 'white',
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                                    boxShadow: isEditing ? '0 10px 20px rgba(15, 23, 42, 0.2)' : '0 10px 20px rgba(79, 70, 229, 0.3)', 
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit2 size={18} /> Edit Profile</>}
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem 0 0', borderTop: '1px solid #F1F5F9', marginTop: '2rem', display: 'flex', gap: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem', fontWeight: 600, color: '#64748B' }}>
                            <MapPin size={18} color="#4F46E5" /> 
                            {isEditing ? (
                                <input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} style={{...inputStyle, padding: '6px 12px', width: 220}} />
                            ) : profile.location}
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Main Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
                
                {/* Left Side Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    
                    {/* Focus Intelligence Graph */}
                    <PremiumCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Activity size={24} color="#6366f1" /> Learning Intelligence Graph
                            </h3>
                            <div style={{ color: '#10B981', fontWeight: 800, background: '#E1F9EB', padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem' }}>↗ Increasing Trend</div>
                        </div>
                        <div style={{ height: 260, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs><linearGradient id="pColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 700, fontSize: 13 }} dy={10} />
                                    <YAxis hide domain={[0, 110]} />
                                    <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={5} fill="url(#pColor)" animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </PremiumCard>

                    {/* Portfolio Sections */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <PremiumCard>
                            <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>Role Experience</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {profile.experiences.map((exp: string, i: number) => (
                                    <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', position: 'relative', border: '1px solid #F1F5F9' }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{exp}</p>
                                        {isEditing && <Trash2 size={16} color="#EE4444" style={{ cursor: 'pointer', position: 'absolute', top: 12, right: 12 }} onClick={() => handleRemoveItem('experiences', i)} />}
                                    </div>
                                ))}
                                {isEditing && (
                                    addItemType === 'experiences' ? (
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <input autoFocus value={itemInput} onChange={e => setItemInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddItem('experiences')} style={inputStyle} placeholder="Add entry..." />
                                            <button onClick={() => handleAddItem('experiences')} style={{ background: '#6366F1', color: 'white', border: 'none', padding: '0 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>Add</button>
                                        </div>
                                    ) : <button onClick={() => setAddItemType('experiences')} style={{ padding: '1rem', border: '1px dashed #6366F1', borderRadius: '16px', color: '#6366f1', fontWeight: 700, background: 'transparent', cursor: 'pointer' }}>+ Add Exp</button>
                                )}
                            </div>
                        </PremiumCard>

                        <PremiumCard>
                            <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>Certifications</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {profile.certifications.map((cert: string, i: number) => (
                                    <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', position: 'relative', border: '1px solid #F1F5F9' }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{cert}</p>
                                        {isEditing && <Trash2 size={16} color="#EE4444" style={{ cursor: 'pointer', position: 'absolute', top: 12, right: 12 }} onClick={() => handleRemoveItem('certifications', i)} />}
                                    </div>
                                ))}
                                {isEditing && (
                                    addItemType === 'certifications' ? (
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <input autoFocus value={itemInput} onChange={e => setItemInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddItem('certifications')} style={inputStyle} placeholder="Add entry..." />
                                            <button onClick={() => handleAddItem('certifications')} style={{ background: '#6366F1', color: 'white', border: 'none', padding: '0 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>Add</button>
                                        </div>
                                    ) : <button onClick={() => setAddItemType('certifications')} style={{ padding: '1rem', border: '1px dashed #6366F1', borderRadius: '16px', color: '#6366f1', fontWeight: 700, background: 'transparent', cursor: 'pointer' }}>+ Add Cert</button>
                                )}
                            </div>
                        </PremiumCard>
                    </div>

                    <PremiumCard>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Core Specializations</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {profile.focusAreas.map((skill, i) => (
                                <div key={skill} style={{ padding: '10px 20px', background: '#F8FAFC', borderRadius: '100px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {skill} {isEditing && <X size={14} color="#EF4444" style={{ cursor: 'pointer' }} onClick={() => handleRemoveItem('focusAreas', i)} />}
                                </div>
                            ))}
                            {isEditing && (
                                addItemType === 'focusAreas' ? (
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <input autoFocus value={itemInput} onChange={e => setItemInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddItem('focusAreas')} style={{...inputStyle, padding: '8px 16px', width: 200}} placeholder="New Skill..." />
                                        <button onClick={() => handleAddItem('focusAreas')} style={{ background: '#6366F1', color: 'white', border: 'none', padding: '0 12px', borderRadius: 12, cursor: 'pointer' }}>Add</button>
                                    </div>
                                ) : <div onClick={() => setAddItemType('focusAreas')} style={{ padding: '10px 20px', borderRadius: '100px', border: '1px dashed #6366F1', color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}>+ Add Skill</div>
                            )}
                        </div>
                    </PremiumCard>
                </div>

                {/* Right Side Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <PremiumCard>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2.5rem' }}>Intelligence Status</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {BADGE_DEFINITIONS.map(badge => {
                                const prog = badge.getProgress(ctx);
                                const isDone = prog >= badge.requirement;
                                return (
                                    <div key={badge.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                        <div style={{ 
                                            width: 60, height: 60, borderRadius: '20px', 
                                            background: isDone ? `${badge.color}15` : '#F1F5F9', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                            fontSize: '1.5rem', filter: isDone ? 'none' : 'grayscale(1)' 
                                        }}>{badge.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{badge.title}</span>
                                                <span style={{ fontSize: '0.8rem', color: badge.color, fontWeight: 900 }}>{Math.min(100, Math.round((prog/badge.requirement)*100))}%</span>
                                            </div>
                                            <div style={{ height: 6, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (prog/badge.requirement)*100)}%` }} style={{ height: '100%', background: badge.color }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </PremiumCard>

                    {/* XP Progress Card */}
                    <PremiumCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: '2rem' }}>
                            <div style={{ padding: 12, background: '#FFF7ED', borderRadius: '16px' }}><Zap size={24} color="#f59e0b" /></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>RANK PROGRESSION</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{xp.toLocaleString()} XP</div>
                            </div>
                        </div>
                        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                            <div style={{ width: `${(xp % 1000) / 10}%`, height: '100%', background: 'linear-gradient(90deg, #4F46E5, #06B6D4)' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                            <span style={{ color: '#4F46E5' }}>LVL {Math.floor(xp / 1000) + 1}</span>
                            <span style={{ color: '#64748B' }}>{1000 - (xp % 1000)} XP TO NEXT RANK</span>
                        </div>
                    </PremiumCard>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
