'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Compass, Brain, Calculator, BarChart3, Upload, Globe, Settings, Shield, User, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ locale }: { locale: string }) => {
  const t = useTranslations('Common');
  const pathname = usePathname();

  const links = [
    { href: `/${locale}`, icon: LayoutDashboard, label: t('dashboard') },
    { href: `/${locale}/roadmaps`, icon: Compass, label: t('roadmaps') },
    { href: `/${locale}/arch-intel`, icon: Brain, label: t('archIntelligence') },
    { href: `/${locale}/auditor`, icon: ShieldCheck, label: 'Code Auditor' },
    { href: `/${locale}/simulator`, icon: Calculator, label: t('financialSimulator') },
    { href: `/${locale}/interview`, icon: Sparkles, label: t('mockInterview') },
    { href: `/${locale}/progress`, icon: BarChart3, label: t('progress') },
    { href: `/${locale}/uploads`, icon: Upload, label: t('uploads') },
    { href: `/${locale}/security`, icon: Shield, label: t('security') },
    { href: `/${locale}/profile`, icon: User, label: t('profile') },
    { href: `/${locale}/settings`, icon: Settings, label: t('settings') },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 p-6 flex flex-col gap-8 shadow-sm">
      <div className="flex items-center gap-3 px-2">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-2xl bg-[#FFA500] flex items-center justify-center shadow-sm"
        >
          <span className="text-white font-[900] text-2xl font-sans">A</span>
        </motion.div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">Arch-Intel</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1 relative">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 active:scale-95",
                isActive ? "text-primary font-bold" : "text-muted hover:text-foreground hover:bg-surface"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-xl"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}
              
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className={cn("relative z-10", isActive && "text-primary")}
              >
                <Icon size={18} />
              </motion.div>
              
              <motion.span 
                className="relative z-10 text-sm"
                whileHover={{ x: 2 }}
              >
                {link.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-auto pt-6 border-t border-border flex flex-col gap-1"
      >
        <LanguageSelector currentLocale={locale} />
      </motion.div>
    </aside>
  );
};

const LanguageSelector = ({ currentLocale }: { currentLocale: string }) => {
  const t = useTranslations('Common');
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'mr', label: 'मराठी' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = window.location.pathname.split('/');
    segments[1] = newLocale;
    window.location.pathname = segments.join('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-2 pb-4"
    >
      <div className="flex items-center gap-2 mb-2 px-1 text-xs font-semibold text-muted uppercase tracking-wider">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <Globe size={14} />
        </motion.div>
        {t('language')}
      </div>
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        className="w-full bg-surface border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all hover:bg-white"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default Sidebar;
