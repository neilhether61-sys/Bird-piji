import { Mail, Clock, ShieldAlert, KeyRound, Infinity, WifiOff, Award, ChevronRight, Play, Eye, Sparkles } from 'lucide-react';
import { ViewType, Letter } from '../types';
import { motion } from 'motion/react';
import { generateDemoLetters, saveLetters, loadLetters } from '../utils';

interface LandingPageProps {
  setView: (view: ViewType) => void;
  setLetters: (letters: Letter[]) => void;
}

export default function LandingPage({ setView, setLetters }: LandingPageProps) {

  const handleSeeDemo = () => {
    // Generate demo letters
    const demos = generateDemoLetters();
    const current = loadLetters();
    
    // Add demos to existing if they are not already there
    const merged = [...current];
    demos.forEach(demo => {
      if (!merged.some(l => l.id === demo.id)) {
        merged.push(demo);
      }
    });

    saveLetters(merged);
    setLetters(merged);
    setView('letters');
  };

  const handleWriteClick = () => {
    setView('write');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 md:pt-14 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center mb-24" id="about-section">
        
        {/* Left column: Copy & CTAs */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-light-orange px-3.5 py-1.5 text-xs font-semibold text-brand-orange dark:bg-brand-dark-orange/30 dark:text-brand-orange mb-6"
          >
            <Sparkles size={12} />
            <span>100% Private Time Capsule</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1] mb-6"
          >
            Write a Letter to Your <span className="text-brand-orange relative inline-block">Future Self<span className="absolute left-0 bottom-1 w-full h-[6px] bg-brand-orange/20 rounded-full"></span></span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
          >
            Write today. Read it months or years later. Your letters stay safely encrypted inside your own browser's local storage.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={handleWriteClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-4 text-base font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-hover hover:scale-[1.02] transition-all active:scale-95 cursor-pointer soft-glow-button"
              id="hero-write-cta"
            >
              Write My First Letter
              <ChevronRight size={18} />
            </button>
            <button
              onClick={handleSeeDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-8 py-4 text-base font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              id="hero-see-demo-cta"
            >
              <Play size={16} fill="currentColor" />
              See Demo Letters
            </button>
          </motion.div>
        </div>

        {/* Right column: Glowing Envelope with clock illustration */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[340px]"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-radial from-brand-orange/20 to-transparent blur-3xl rounded-full scale-110" />

            {/* Glowing Envelope with small clock */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 rounded-3xl shadow-[0_20px_50px_rgba(255,122,0,0.12)] flex flex-col items-center"
            >
              {/* Animated Floating Clock */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                className="absolute -top-4 -right-4 bg-brand-orange text-white p-3 rounded-2xl shadow-lg shadow-brand-orange/30"
              >
                <Clock size={24} className="stroke-[2.5]" />
              </motion.div>

              {/* Envelope Design */}
              <div className="w-full aspect-[4/3] bg-brand-light-orange dark:bg-brand-dark-orange/20 rounded-2xl border border-brand-orange/20 flex items-center justify-center relative overflow-hidden mb-6 group">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="text-brand-orange"
                >
                  <Mail size={64} className="stroke-[1.5]" />
                </motion.div>
                
                {/* Visual Letter Slits */}
                <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-dashed border-brand-orange/30" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-brand-orange/10 to-transparent" />
              </div>

              <div className="w-full text-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-brand-orange">Encrypted Capsule</span>
                <h3 className="font-display font-bold text-lg text-neutral-800 dark:text-neutral-100 mt-1">To: My Future Self</h3>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-full inline-flex border border-neutral-100 dark:border-neutral-800">
                  <Clock size={12} className="text-brand-orange" />
                  <span>Unlocks on chosen date</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-24 scroll-mt-24" id="how-it-works-section">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 block mb-3">Simple Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">How It Works</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-md mx-auto">Three steps to talk to your future self in just a few clicks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Write */}
          <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-brand-orange/20 dark:hover:border-brand-orange/30 transition-all group flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-brand-light-orange dark:bg-brand-dark-orange/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform">
              ✍️
            </div>
            <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2">Write</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Write anything you want — memories, current struggles, dreams, or specific questions for your future self.
            </p>
          </div>

          {/* Card 2: Lock */}
          <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-brand-orange/20 dark:hover:border-brand-orange/30 transition-all group flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-brand-light-orange dark:bg-brand-dark-orange/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform">
              📅
            </div>
            <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2">Lock</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Choose the unlock date. It can be a week, a year, or a decade from now. Once locked, it stays secure.
            </p>
          </div>

          {/* Card 3: Read */}
          <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-brand-orange/20 dark:hover:border-brand-orange/30 transition-all group flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-brand-light-orange dark:bg-brand-dark-orange/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform">
              📬
            </div>
            <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2">Read</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Receive a countdown reminder, come back on the unlock date, and experience a rush of nostalgia.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 block mb-3">Key Features</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">Private, Light, and Free</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-md mx-auto">No corporate servers, no logins. Just pure, simple nostalgia stored securely on your device.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* F1: 100% Private */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="p-2.5 bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 rounded-xl">
              <KeyRound size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">100% Private</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">Your data never leaves your device. No cloud storage means zero leak risks.</p>
            </div>
          </div>

          {/* F2: Stored Only In Your Browser */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="p-2.5 bg-brand-light-orange text-brand-orange dark:bg-brand-dark-orange/30 dark:text-brand-orange rounded-xl">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Browser Bound</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">Utilizes local browser sandbox. Encrypted internally inside your client profile.</p>
            </div>
          </div>

          {/* F3: No Login Required */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">No Login Required</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">No email, passwords, or registration cycles. Start writing in two seconds.</p>
            </div>
          </div>

          {/* F4: Unlimited Letters */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="p-2.5 bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 rounded-xl">
              <Infinity size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Unlimited Letters</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">Write as many capsules as you want. Perfect for tracking long-term growth.</p>
            </div>
          </div>

          {/* F5: Works Offline */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="p-2.5 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 rounded-xl">
              <WifiOff size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Works Offline</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">Write, lock, and manage offline. No active internet required to operate.</p>
            </div>
          </div>

          {/* F6: Free Forever */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="p-2.5 bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Free Forever</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">Zero hidden subscriptions, no ads, no paywalls. A pure nostalgic project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Card Section */}
      <section className="mb-24">
        <div className="bg-brand-light-orange dark:bg-brand-dark-orange/10 border border-brand-orange/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-md text-center md:text-left">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-2">Live Demo Sandbox</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">Want to test it out right now?</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-3 leading-relaxed">
              We've created a preset of demo capsules — some locked, some ready to open right away. Experience the custom transitions, celebration states, and paper rendering in one click.
            </p>
            <button
              onClick={handleSeeDemo}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange-hover active:scale-95 transition-all cursor-pointer"
              id="preview-load-demo-btn"
            >
              <Eye size={16} />
              Load Interactive Demo
            </button>
          </div>

          {/* Interactive Preview Card Mockup */}
          <div className="w-full max-w-[280px] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 rounded-2xl shadow-lg shadow-neutral-200/50 dark:shadow-none flex flex-col items-center">
            {/* Minimal SVG Envelope */}
            <div className="w-16 h-12 bg-brand-light-orange dark:bg-brand-dark-orange/20 border border-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange mb-4">
              <Mail size={24} />
            </div>
            <h4 className="font-display font-bold text-neutral-800 dark:text-neutral-100 text-sm">Letter to 2030 Me</h4>
            
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-orange" />
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Locked</span>
            </div>

            <div className="text-center mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-4 w-full">
              <span className="text-neutral-400 text-[10px] block uppercase tracking-wider font-semibold">Time Remaining</span>
              <span className="font-mono text-lg font-bold text-neutral-800 dark:text-neutral-100">842 Days Remaining</span>
            </div>

            <button
              disabled
              className="mt-5 w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-full py-2.5 text-xs font-bold cursor-not-allowed border border-neutral-200/40 dark:border-neutral-700/40"
              id="preview-locked-btn"
            >
              Cannot Open Yet
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 dark:border-neutral-900 pt-8 mt-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            <span className="font-display font-bold text-neutral-800 dark:text-neutral-200">Future Letter</span>
            <p className="mt-1">All rights reserved © 2026. Your memories stay offline.</p>
          </div>
          <div className="font-mono text-[10px] bg-neutral-50 dark:bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-100 dark:border-neutral-800">
            Made with HTML CSS JavaScript LocalStorage
          </div>
          <div className="flex gap-4">
            <span className="hover:text-brand-orange cursor-pointer transition-colors">Privacy</span>
            <span>•</span>
            <span className="hover:text-brand-orange cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
