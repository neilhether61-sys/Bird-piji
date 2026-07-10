import { useState, useEffect } from 'react';
import { ViewType, Letter } from '../types';
import { ArrowLeft, Clock, Calendar, Heart, MailOpen, AlertTriangle, Sparkles, Volume2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadLetters, saveLetters } from '../utils';

interface OpenLetterPageProps {
  setView: (view: ViewType) => void;
  selectedLetterId: string | null;
  setSelectedLetterId: (id: string | null) => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

export default function OpenLetterPage({
  setView,
  selectedLetterId,
  setSelectedLetterId
}: OpenLetterPageProps) {
  
  const letters = loadLetters();
  const letter = letters.find(l => l.id === selectedLetterId);

  // States
  const [isOpened, setIsOpened] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // If letter does not exist, go back
  useEffect(() => {
    if (!letter) {
      setView('letters');
    } else {
      // If already opened once, we can skip the click-to-open envelope, or keep it for the premium interaction!
      // Let's keep it but allow direct interaction so they can re-enjoy the magic.
    }
  }, [letter, setView]);

  // Generate confetti particles on successful opening
  const triggerConfetti = () => {
    const colors = ['#FF7A00', '#FFB066', '#FFD299', '#4ADE80', '#60A5FA', '#F472B6', '#FBBF24'];
    const particles: ConfettiParticle[] = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage across screen
      y: -10 - Math.random() * 20, // start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6, // sizes 6px - 14px
      delay: Math.random() * 0.5,
      duration: Math.random() * 2.5 + 2 // falls in 2 - 4.5s
    }));
    setConfetti(particles);

    // Save as opened in database so it can show as unlocked/opened permanently
    if (letter) {
      const updated = letters.map(l => {
        if (l.id === letter.id) {
          return { ...l, isOpened: true };
        }
        return l;
      });
      saveLetters(updated);
    }
  };

  const handleEnvelopeClick = () => {
    if (isOpened) return;
    setIsOpened(true);
    triggerConfetti();
  };

  const handleBack = () => {
    setSelectedLetterId(null);
    setView('letters');
  };

  if (!letter) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden pb-24 pt-6">
      
      {/* Confetti canvas emulator */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {confetti.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: `${p.y}vh`, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
            animate={{ 
              y: '105vh', 
              x: `${p.x + (Math.random() * 20 - 10)}vw`,
              rotate: 360 * (Math.random() * 4 + 1),
              opacity: [1, 1, 1, 0.4, 0]
            }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay, 
              ease: "easeOut" 
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '20%',
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        
        {/* Navigation row */}
        <div className="flex items-center justify-between mb-8 relative z-30">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            id="open-view-back-btn"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          {isOpened && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              id="print-letter-btn"
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* 1. CLOSED STATE: Interactive envelope container */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -40 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-12 relative z-20 cursor-pointer group"
              onClick={handleEnvelopeClick}
              id="interactive-envelope-trigger"
            >
              <div className="text-center mb-8 max-w-sm">
                <span className="text-[11px] font-bold text-brand-orange uppercase tracking-widest bg-brand-light-orange dark:bg-brand-dark-orange/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles size={11} className="animate-pulse" /> Ready to Unseal
                </span>
                <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-3">
                  Tap the envelope to open your letter
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1.5 leading-relaxed">
                  You successfully reached the chosen date. Tap to reveal your thoughts from the past.
                </p>
              </div>

              {/* Envelope visual block */}
              <div className="relative w-full max-w-[420px] aspect-[4/3] bg-brand-light-orange dark:bg-brand-dark-orange/10 border-2 border-brand-orange/20 rounded-3xl p-4 shadow-[0_30px_60px_rgba(255,122,0,0.15)] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_40px_70px_rgba(255,122,0,0.22)]">
                {/* Visual Flap */}
                <div className="absolute top-0 inset-x-0 h-1/2 border-b-2 border-dashed border-brand-orange/30 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, -4, 0, 4, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="h-14 w-14 bg-white dark:bg-neutral-900 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange shadow-md"
                  >
                    <Heart size={28} className="fill-brand-orange/10" />
                  </motion.div>
                </div>

                {/* Sender/Receiver lines */}
                <div className="absolute bottom-6 left-6 text-left">
                  <span className="text-[10px] font-mono text-brand-orange block uppercase tracking-wider font-semibold">Capsule ID</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">#{letter.id.slice(7, 13)}</span>
                </div>

                <div className="absolute bottom-6 right-6 text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider font-semibold">Mood Locked</span>
                  <span className="text-lg">{letter.mood}</span>
                </div>

                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>

              <div className="mt-8 text-neutral-400 text-xs font-bold flex items-center gap-1.5 animate-bounce">
                <span>👇 Click anywhere on the capsule to unseal</span>
              </div>
            </motion.div>
          ) : (
            /* 2. OPEN STATE: Beautiful letter sheet on premium paper */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
              className="relative z-10"
              id="revealed-letter-paper"
            >
              {/* Paper body */}
              <div className="bg-[#FAF8F5] dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 p-8 sm:p-14 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.06)] border border-amber-900/5 dark:border-neutral-800 relative overflow-hidden print:p-0 print:bg-white print:text-black print:shadow-none print:border-none">
                
                {/* Paper texture/background detail */}
                <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-150/50 dark:bg-neutral-800/40 print:hidden" />
                <div className="absolute top-12 left-0 right-0 h-[1px] bg-amber-900/10 dark:bg-neutral-800/20 print:hidden" />

                {/* Letter Header */}
                <div className="border-b border-neutral-200/60 dark:border-neutral-800 pb-6 mb-8 relative pl-6">
                  
                  {/* Floating Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider">
                      <Calendar size={13} />
                      <span>Written: {new Date(letter.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <Clock size={13} />
                      <span>Unlocked: {new Date(letter.unlockDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 mt-4 tracking-tight leading-tight">
                    {letter.title}
                  </h1>

                  {/* Mood banner */}
                  <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    <span>Mood at writing:</span>
                    <span className="text-lg bg-white dark:bg-neutral-950 px-2 py-0.5 rounded-full border border-neutral-200/50 dark:border-neutral-800 inline-flex items-center gap-1">
                      {letter.mood}
                    </span>
                  </div>
                </div>

                {/* Letter Body Content */}
                <div className="pl-6 font-sans text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap tracking-wide mb-12 min-h-[250px] font-light">
                  {letter.content}
                </div>

                {/* Letter Footer Signature */}
                <div className="pl-6 border-t border-neutral-200/60 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
                  <div>
                    <p className="font-semibold text-neutral-600 dark:text-neutral-300">Sincerely,</p>
                    <p className="text-[13px] font-bold text-neutral-800 dark:text-neutral-200 mt-1 font-display">Your Past Self</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-orange bg-brand-light-orange dark:bg-brand-dark-orange/20 px-2.5 py-1 rounded-full">
                      Sealed with Future Letter
                    </span>
                  </div>
                </div>

              </div>

              {/* Close Button back to dashboard */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleBack}
                  className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white px-8 py-3.5 text-sm font-bold shadow-md shadow-brand-orange/20 active:scale-95 transition-all cursor-pointer"
                  id="revealed-close-btn"
                >
                  Return to My Letters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
