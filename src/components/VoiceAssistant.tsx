'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';

const VoiceAssistant = () => {
    const [isActive, setIsActive] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [os, setOs] = useState<'mac' | 'windows'>('mac');
    const router = useRouter();
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            setOs(isMac ? 'mac' : 'windows');
        }
    }, []);

    const speak = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = useCallback((command: string) => {
        const cmd = command.toLowerCase();
        console.log('Voice Command Received:', cmd);
        
        const routes: Record<string, string> = {
            'dashboard': '/',
            'home': '/',
            'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್': '/',
            'डैशबोर्ड': '/',
            'டாஷ்போர்டு': '/',
            'ഡാഷ്ബോർഡ്': '/',
            'డాష్‌బోర్డ్': '/',
            'roadmaps': '/roadmaps',
            'roadmap': '/roadmaps',
            'skill tree': '/roadmaps',
            'ರೋಡ್‌ಮ್ಯಾಪ್': '/roadmaps',
            'रोडमॅप': '/roadmaps',
            'சாலை வரைபடம்': '/roadmaps',
            'റോഡ്മാപ്പ്': '/roadmaps',
            'రోడ్‌మ్యాಪ್': '/roadmaps',
            'intelligence': '/arch-intel',
            'architecture': '/arch-intel',
            'diagram': '/arch-intel',
            'ಇಂಟೆಲಿಜೆನ್ಸ್': '/arch-intel',
            'इंटेलिजन्स': '/arch-intel',
            'இன்டெலிஜென்ஸ்': '/arch-intel',
            'ഇന്റലിജൻസ്': '/arch-intel',
            'ఇంటెలిజెన్స్': '/arch-intel',
            'simulator': '/simulator',
            'financial': '/simulator',
            ' money': '/simulator',
            'progress': '/progress',
            'analytics': '/progress',
            'stats': '/progress',
            'uploads': '/uploads',
            'upload': '/uploads',
            'code': '/uploads',
            'repository': '/uploads',
            'settings': '/settings',
            'account': '/settings',
            'profile': '/settings',
            'accessibility': '/accessibility',
            'inclusive': '/accessibility',
            'security': '/security',
            'privacy': '/security',
            'trust': '/security'
        };

        for (const [keyword, path] of Object.entries(routes)) {
            if (cmd.includes(keyword)) {
                // Immediately stop listening so next words aren't captured
                if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch(e) {}
                }
                speak(`Opening ${keyword}...`);
                router.push(path);
                setTranscript(`Navigating to ${keyword.toUpperCase()}`);
                
                // Automatically turn off voice mode after navigation
                setTimeout(() => {
                    window.speechSynthesis?.cancel();
                    setIsActive(false);
                    setTranscript('');
                }, 1200); 
                return true;
            }
        }

        if (cmd.includes('stop') || cmd.includes('close') || cmd.includes('off')) {
            speak('Deactivating Voice Mode.');
            setIsActive(false);
            return true;
        }

        return false;
    }, [router]);

    useEffect(() => {
        if (isActive && typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                
                // Map app locale to SpeechRecognition locale
                const localeMap: Record<string, string> = {
                    'en': 'en-US',
                    'hi': 'hi-IN',
                    'kn': 'kn-IN',
                    'ta': 'ta-IN',
                    'te': 'te-IN',
                    'ml': 'ml-IN',
                    'mr': 'mr-IN'
                };
                
                // Extract locale from pathname if not provided or use en
                const pathLocale = window.location.pathname.split('/')[1];
                recognitionRef.current.lang = localeMap[pathLocale] || 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        const result = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            setTranscript(result);
                            processCommand(result);
                        } else {
                            interimTranscript += result;
                        }
                    }
                    if (interimTranscript) {
                        setTranscript(interimTranscript);
                    }
                };

                recognitionRef.current.onstart = () => {
                    console.log('Speech recognition started');
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    if (event.error === 'not-allowed') {
                        alert('Please allow microphone access to use Voice Mode.');
                        setIsActive(false);
                    }
                };

                recognitionRef.current.onend = () => {
                    if (isActive) {
                        // Auto-restart if still active
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            console.error('Failed to restart recognition:', e);
                        }
                    }
                };

                recognitionRef.current.start();
                speak('Voice Mode Active. How can I help?');
            } else {
                alert('Voice recognition is not supported in this browser.');
                setIsActive(false);
            }
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
            setTranscript('');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isActive, processCommand]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsActive(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsActive(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            {/* Real-time Transcript / Subtitles (The "Beside it" UI) */}
            <AnimatePresence>
                {isActive && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        className="mr-2 mb-2 p-5 bg-[#1A1C1E] text-white rounded-[32px] shadow-2xl border border-white/10 flex items-center gap-6 min-w-[300px] max-w-[500px]"
                    >
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Listening...</span>
                            <p className="text-sm font-bold leading-relaxed text-gray-200 line-clamp-2 italic">
                                "{transcript || "Say 'Open Roadmaps' or 'Open Simulator'..."}"
                            </p>
                        </div>
                        <div className="flex gap-1.5 h-8 items-center">
                            {[1, 2, 3, 2, 4, 1, 3, 2].map((h, i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ height: transcript ? [4, h * 6, 4] : 4 }}
                                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                                    className="w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,153,0,0.5)]"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
                {/* Main Voice Mode Control (Medium sized icon and title) */}
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`group flex items-center gap-4 px-8 py-5 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-90 ${
                        isActive 
                        ? 'bg-primary text-white scale-110 shadow-orange-200/40' 
                        : 'bg-white text-foreground hover:bg-surface ring-1 ring-black/5'
                    }`}
                >
                    <div className="relative">
                        <Mic size={28} className={isActive ? 'animate-pulse' : ''} />
                        {isActive && (
                            <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
                        )}
                    </div>
                    <div className="flex flex-col items-start leading-[1.1]">
                        <span className="text-base font-black tracking-tight">Voice Mode</span>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${isActive ? 'text-white/80' : 'text-muted'}`}>
                            {os === 'mac' ? '⌘ + K' : 'Ctrl + K'}
                        </span>
                    </div>
                </button>

                {isActive && (
                    <button 
                        onClick={() => setIsActive(false)}
                        className="bg-black text-white p-5 rounded-[32px] shadow-xl hover:bg-gray-900 transition-all active:scale-95"
                        title="Turn Off Voice Mode"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default VoiceAssistant;
