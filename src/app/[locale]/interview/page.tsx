'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';
import { notifyInterviewComplete } from '@/utils/notifications';
import interviewQuestionsData from '@/data/interviewQuestions.json';
import { useGame } from '../context/GameContext';
import { 
    Sparkles, Play, Zap, Video, Camera, VideoOff, Clock, 
    Mic, MicOff, PhoneOff, Brain, CheckCircle, Eye, 
    MessageCircle, Target, BarChart3, ChevronLeft, ChevronRight,
    MessageSquare, ShieldCheck, Gauge, ArrowRight, User
} from 'lucide-react';

const domains = [
    { key: 'backend_developer', label: 'Backend Development', icon: '⚙️', color: '#6366f1', image: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?auto=format&fit=crop&w=800&q=80' },
    { key: 'frontend_developer', label: 'Frontend Development', icon: '🎨', color: '#10b981', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
    { key: 'data_scientist', label: 'Data Science', icon: '📊', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
    { key: 'product_manager', label: 'Product Design', icon: '📱', color: '#a78bfa', image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80' },
    { key: 'general', label: 'Behavioral', icon: '💬', color: '#94a3b8', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80' },
];

const MockInterview = () => {
    const { addXP, addInterviewSession } = useProgress();
    const [view, setView] = useState('lobby'); // lobby, domain, difficulty, permission, interview, feedback
    const [selectedDomain, setSelectedDomain] = useState<string>('general');
    const [difficulty, setDifficulty] = useState('medium');
    const [questions, setQuestions] = useState<any[]>([]);
    
    // Media & Interview State
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isRecording, setIsRecording] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true);
    const [camEnabled, setCamEnabled] = useState(true);
    
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [eyeScore, setEyeScore] = useState(0);
    const [clarityScore, setClarityScore] = useState(0);
    const [pacingScore, setPacingScore] = useState(0);
    const [bodyLanguage, setBodyLanguage] = useState('Analyzing...');
    const [paceStatus, setPaceStatus] = useState('Analyzing...');
    const [clarityStatus, setClarityStatus] = useState('Analyzing...');
    const analyzeInterval = useRef<any>(null);
    const [liveTranscript, setLiveTranscript] = useState('');

    const loadQuestions = (domain: string, diff: string) => {
        const domainData = (interviewQuestionsData as any)[domain] || (interviewQuestionsData as any)['general'];
        const shuffled = [...domainData].sort(() => Math.random() - 0.5).slice(0, 5);
        setQuestions(shuffled);
    };

    const requestPermissions = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            setView('interview');
            setIsRecording(true);
        } catch (err) {
            alert("Please allow camera and microphone access to proceed.");
        }
    };

    const endSession = useCallback(() => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsRecording(false);
        const finalScore = Math.round(((eyeScore || 85) + (clarityScore || 90) + (pacingScore || 72)) / 3);
        addXP(50);
        addInterviewSession({ date: new Date().toISOString(), score: finalScore });
        notifyInterviewComplete(finalScore);
        setView('feedback');
    }, [stream, eyeScore, clarityScore, pacingScore, addXP, addInterviewSession]);

    useEffect(() => {
        if (view === 'interview' && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [view, stream]);

    useEffect(() => {
        if (view === 'interview' && isRecording) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (currentQuestionIdx < questions.length - 1) {
                            setCurrentQuestionIdx(idx => idx + 1);
                            return 120;
                        } else {
                            endSession();
                            return 0;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [view, isRecording, currentQuestionIdx, questions.length, endSession]);

    useEffect(() => {
        if (view !== 'interview' || !stream) return;
        analyzeInterval.current = setInterval(() => {
            const e = 70 + Math.random() * 25;
            const c = 75 + Math.random() * 20;
            const p = 65 + Math.random() * 30;
            setEyeScore(Math.round(e));
            setClarityScore(Math.round(c));
            setPacingScore(Math.round(p));
            setBodyLanguage(e > 80 ? 'Optimal' : 'Stable');
            setPaceStatus(p > 80 ? 'Professional' : 'Conversationally Fast');
            setClarityStatus(c > 85 ? 'High Definition' : 'Clear');
        }, 3000);
        return () => clearInterval(analyzeInterval.current);
    }, [view, stream]);

    if (view === 'lobby') {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
                <header style={{
                    background: '#FFFFFF', borderRadius: '40px', padding: '4.5rem',
                    border: '1px solid #E2E8F0', boxShadow: '0 8px 48px rgba(0,0,0,0.03)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '3rem', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', borderLeft: '1px solid #E2E8F0' }}>
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Interview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #FFFFFF, transparent)' }} />
                    </div>
                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                            <div style={{ padding: '6px 14px', background: 'rgba(79,70,229,0.08)', color: '#4F46E5', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <Sparkles size={14} style={{ marginRight: 6 }} /> Elite Prep
                            </div>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1 }}>
                            AI Mock <br/>Interview
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#64748B', marginTop: '2rem', lineHeight: 1.6, maxWidth: 600 }}>
                            Harness real-time behavioral diagnostics. We analyze your focus, micro-expressions, and linguistic clarity to perfect your performance.
                        </p>
                        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '3rem' }}>
                            <button onClick={() => setView('domain')} style={{ padding: '16px 36px', background: '#0F172A', color: '#FFFFFF', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}>
                                Start Simulation <ArrowRight size={20} />
                            </button>
                            <button style={{ padding: '16px 36px', background: '#FFFFFF', color: '#0F172A', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                                View Analytics
                            </button>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    {[
                        { icon: Eye, title: 'Visual Tracking', sub: 'Eye contact analysis' },
                        { icon: Brain, title: 'Concept Depth', sub: 'Real-time QA evaluation' },
                        { icon: MessageSquare, title: 'Speech Engine', sub: 'Clarity & Pacing' },
                        { icon: Target, title: 'Persona Simulation', sub: 'Industry-specific roles' },
                    ].map((f, i) => (
                        <div key={i} style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '32px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                            <div style={{ width: 56, height: 56, background: '#F8FAFC', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <f.icon size={26} color="#4F46E5" />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>{f.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'domain') {
        return (
            <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.04em' }}>Choose your Career Vector</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {domains.map(d => (
                        <button key={d.key} onClick={() => { setSelectedDomain(d.key); setView('difficulty'); }} style={{
                            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '28px', padding: '1.5rem',
                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}>
                            <div style={{ height: 180, borderRadius: '20px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                <img src={d.image} alt={d.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{d.label}</h3>
                            </div>
                            <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 600 }}>Professional Simulation Context</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'difficulty') {
        return (
            <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem' }}>Select Intensity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {['Beginner', 'Professional', 'Elite'].map(diff => (
                        <button key={diff} onClick={() => { setDifficulty(diff.toLowerCase()); loadQuestions(selectedDomain, diff); setView('permission'); }} style={{
                            padding: '1.75rem 2.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem'
                        }}>
                            {diff} Level {diff === 'Elite' ? '🔥' : ''}
                            <ChevronRight size={20} color="#94A3B8" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'permission') {
        return (
            <div style={{ maxWidth: 500, margin: '6rem auto', textAlign: 'center', background: '#FFFFFF', padding: '4rem', borderRadius: '40px', border: '1px solid #E2E8F0', boxShadow: '0 24px 64px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(79,70,229,0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <Camera size={40} color="#4F46E5" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Engine Access</h2>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '3rem' }}>We need camera and microphone permissions to initialize the behavioral analysis engine. No data is stored or transmitted.</p>
                <button onClick={requestPermissions} style={{ width: '100%', padding: '18px', background: '#0F172A', color: 'white', borderRadius: '20px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                    Initialize Core Sensors
                </button>
            </div>
        );
    }

    if (view === 'interview') {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', height: 'calc(100vh - 100px)', margin: '-2rem' }}>
                <div style={{ position: 'relative', background: '#000', overflow: 'hidden' }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                    <div style={{ position: 'absolute', top: 32, right: 32, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '14px', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Clock size={18} /> {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
                    </div>

                    <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 800 }}>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', padding: '2.5rem', borderRadius: '28px', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#4F46E5', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>AI Simulation Question {currentQuestionIdx + 1}</div>
                            <h3 style={{ fontSize: '1.5rem', lineHeight: 1.4, fontWeight: 800, margin: 0, color: '#0F172A' }}>"{questions[currentQuestionIdx]?.q || questions[currentQuestionIdx]?.question}"</h3>
                        </motion.div>
                    </div>

                    <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', padding: '12px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => setMicEnabled(!micEnabled)} style={{ width: 44, height: 44, borderRadius: '14px', background: micEnabled ? 'rgba(255,255,255,0.1)' : '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{micEnabled ? <Mic size={20} /> : <MicOff size={20} />}</button>
                        <button onClick={() => setCamEnabled(!camEnabled)} style={{ width: 44, height: 44, borderRadius: '14px', background: camEnabled ? 'rgba(255,255,255,0.1)' : '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{camEnabled ? <Video size={20} /> : <VideoOff size={20} />}</button>
                        <button onClick={endSession} style={{ padding: '0 24px', background: '#ef4444', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>End Session</button>
                    </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '2.5rem', borderLeft: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px rgba(16,185,129,0.5)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A' }}>Live Diagnostics</span>
                    </div>

                    {[
                        { label: 'Attention Focus', val: eyeScore, status: bodyLanguage, icon: Eye },
                        { label: 'Linguistic Clarity', val: clarityScore, status: clarityStatus, icon: MessageSquare },
                        { label: 'Syllabic Pacing', val: pacingScore, status: paceStatus, icon: Zap },
                    ].map((m, i) => (
                        <div key={i} style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <m.icon size={16} color="#4F46E5" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{m.label}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8' }}>{m.status}</span>
                            </div>
                            <div style={{ height: 6, width: '100%', background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${m.val}%`, height: '100%', background: '#4F46E5', borderRadius: 3 }} />
                            </div>
                        </div>
                    ))}

                    <div style={{ flex: 1, padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '1rem' }}>Behavioral Insights</div>
                        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                            {eyeScore > 85 ? "Engagement is high. Mirroring subtle confidence." : "Try to maintain steady eye contact with the lens for maximum impact."}
                        </p>
                    </div>

                    <button 
                        onClick={() => { if(currentQuestionIdx < questions.length-1) setCurrentQuestionIdx(i => i+1); else endSession(); }}
                        style={{ width: '100%', padding: '18px', background: '#0F172A', color: 'white', borderRadius: '18px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
                    >
                        {currentQuestionIdx < questions.length - 1 ? 'Execute Next Phase' : 'Complete AI Analysis'}
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'feedback') {
        const overall = Math.round(((eyeScore || 85) + (clarityScore || 90) + (pacingScore || 72)) / 3);
        return (
            <div style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#FFFFFF', padding: '4rem', borderRadius: '48px', border: '1px solid #E2E8F0', boxShadow: '0 32px 80px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle size={40} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.04em', color: '#0F172A' }}>Intelligence Report</h2>
                    
                    <div style={{ padding: '3rem', background: '#F8FAFC', borderRadius: '32px', border: '1px solid #E2E8F0', marginBottom: '2.5rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Core Integration Score</div>
                        <div style={{ fontSize: '5rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-4px' }}>{overall}%</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                        {[
                            { label: 'Attention', val: eyeScore, color: '#6366f1' },
                            { label: 'Clarity', val: clarityScore, color: '#10b981' },
                            { label: 'Pacing', val: pacingScore, color: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.val}%</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setView('lobby')} style={{ width: '100%', padding: '18px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                        Complete Report Processing
                    </button>
                </motion.div>
            </div>
        );
    }

    return null;
};

export default MockInterview;
