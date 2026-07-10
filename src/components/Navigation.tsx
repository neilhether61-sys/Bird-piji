import { Mail, Clock, Settings, PenTool, Home, Sun, Moon, Sparkles } from 'lucide-react';
import { ViewType } from '../types';
import { motion } from 'motion/react';

interface NavigationProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  scrollToId: (id: string) => void;
}

export default function Navigation({
  currentView,
  setView,
  darkMode,
  setDarkMode,
  scrollToId
}: NavigationProps) {

  const handleNavClick = (view: ViewType, elementId?: string) => {
    setView(view);
    if (elementId) {
      setTimeout(() => {
        scrollToId(elementId);
      }, 100);
    }
  };

  return (
    <>
      {/* Desktop Top Header & Mobile Header Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md dark:border-neutral-900 dark:bg-neutral-950/80 transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            id="nav-logo-btn"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange text-white shadow-sm shadow-brand-orange/30 transition-transform group-hover:scale-105">
              <span className="font-display font-bold text-lg">FL</span>
              <motion.div
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-light-orange border-2 border-brand-orange dark:border-neutral-950"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Future <span className="text-brand-orange">Letter</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home', 'about-section')}
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              id="desktop-nav-about"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('home', 'how-it-works-section')}
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              id="desktop-nav-how"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('letters')}
              className={`transition-colors cursor-pointer ${
                currentView === 'letters'
                  ? 'text-brand-orange font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
              }`}
              id="desktop-nav-letters"
            >
              My Letters
            </button>
          </nav>

          {/* Utility buttons (Theme, Write) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              aria-label="Toggle dark mode"
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Desktop Write Button */}
            <button
              onClick={() => handleNavClick('write')}
              className="hidden md:flex items-center gap-1.5 rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange-hover transition-all active:scale-95 cursor-pointer soft-glow-button"
              id="desktop-write-btn"
            >
              <PenTool size={15} />
              Write My First Letter
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-100 bg-white/90 backdrop-blur-lg pb-safe dark:border-neutral-900 dark:bg-neutral-950/90 transition-colors duration-200 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex h-16 items-center justify-around px-2 relative">
          
          {/* Home Tab */}
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
              currentView === 'home' ? 'text-brand-orange' : 'text-neutral-400 dark:text-neutral-500'
            }`}
            id="mobile-nav-home"
          >
            <Home size={20} className={currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Letters Tab */}
          <button
            onClick={() => setView('letters')}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
              currentView === 'letters' || currentView === 'open-letter' ? 'text-brand-orange' : 'text-neutral-400 dark:text-neutral-500'
            }`}
            id="mobile-nav-letters"
          >
            <Mail size={20} className={currentView === 'letters' || currentView === 'open-letter' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] font-medium">Letters</span>
          </button>

          {/* Floating Mobile Center Write Button */}
          <div className="relative -top-5 flex justify-center items-center">
            <button
              onClick={() => setView('write')}
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/40 active:scale-90 transition-all ${
                currentView === 'write' ? 'scale-105 bg-brand-orange-hover ring-4 ring-brand-light-orange dark:ring-neutral-900' : ''
              }`}
              aria-label="Write a letter"
              id="mobile-nav-floating-write"
            >
              <PenTool size={22} className="stroke-[2.5px]" />
            </button>
          </div>

          {/* Spacer to balance the floating button */}
          <div className="w-14 h-full pointer-events-none" />

          {/* Settings Tab */}
          <button
            onClick={() => setView('settings')}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
              currentView === 'settings' ? 'text-brand-orange' : 'text-neutral-400 dark:text-neutral-500'
            }`}
            id="mobile-nav-settings"
          >
            <Settings size={20} className={currentView === 'settings' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
          
        </div>
      </div>
    </>
  );
}
