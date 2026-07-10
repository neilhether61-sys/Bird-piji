/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewType, Letter } from './types';
import { loadLetters } from './utils';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import CreateLetterPage from './components/CreateLetterPage';
import MyLettersPage from './components/MyLettersPage';
import OpenLetterPage from './components/OpenLetterPage';
import SettingsPage from './components/SettingsPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Lazy state loading for letters
  const [letters, setLetters] = useState<Letter[]>(() => loadLetters());
  
  // Main Navigation View State
  const [currentView, setView] = useState<ViewType>('home');
  
  // Active/Target Letters
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [editLetterId, setEditLetterId] = useState<string | null>(null);

  // Theme states
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('future_letters_dark') === 'true';
    } catch {
      return false;
    }
  });

  // Dark Mode side effects
  useEffect(() => {
    try {
      if (darkMode) {
        document.body.classList.add('dark');
        localStorage.setItem('future_letters_dark', 'true');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('future_letters_dark', 'false');
      }
    } catch (error) {
      console.error('Failed to set theme in localStorage', error);
    }
  }, [darkMode]);

  // Handle smooth section scrolling for landing links
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Render active view helper
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <LandingPage 
            setView={setView} 
            setLetters={setLetters} 
          />
        );
      case 'write':
        return (
          <CreateLetterPage
            setView={setView}
            setLetters={setLetters}
            editLetterId={editLetterId}
            setEditLetterId={setEditLetterId}
          />
        );
      case 'letters':
        return (
          <MyLettersPage
            letters={letters}
            setLetters={setLetters}
            setView={setView}
            setSelectedLetterId={setSelectedLetterId}
            setEditLetterId={setEditLetterId}
          />
        );
      case 'open-letter':
        return (
          <OpenLetterPage
            setView={setView}
            selectedLetterId={selectedLetterId}
            setSelectedLetterId={setSelectedLetterId}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            letters={letters}
            setLetters={setLetters}
            setView={setView}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      default:
        return <LandingPage setView={setView} setLetters={setLetters} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B] text-neutral-900 dark:text-neutral-50 transition-colors duration-200 selection:bg-brand-orange/10 selection:text-brand-orange pb-16 md:pb-0" id="main-app-container">
      {/* Top Header & Sticky Navigation */}
      <Navigation
        currentView={currentView}
        setView={setView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scrollToId={scrollToId}
      />

      {/* Main Content Area with elegant animations */}
      <main className="relative" id="main-content-flow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

