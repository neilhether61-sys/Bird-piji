import { useState, useTransition } from 'react';
import { ViewType, Letter } from '../types';
import { ArrowLeft, Clock, Save, Trash2, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { saveLetters, loadLetters } from '../utils';

interface CreateLetterPageProps {
  setView: (view: ViewType) => void;
  setLetters: (letters: Letter[]) => void;
  editLetterId?: string | null;
  setEditLetterId: (id: string | null) => void;
}

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😄', label: 'Excited' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
];

export default function CreateLetterPage({
  setView,
  setLetters,
  editLetterId,
  setEditLetterId
}: CreateLetterPageProps) {
  const isPending = false; // Simple local state instead of heavy concurrent transition if not needed, but we can structure with default react 19 hooks or normal hooks

  // If we are editing, let's load the editing letter data
  const existingLetters = loadLetters();
  const editTarget = editLetterId ? existingLetters.find(l => l.id === editLetterId) : null;

  // Form State
  const [title, setTitle] = useState(editTarget ? editTarget.title : '');
  const [content, setContent] = useState(editTarget ? editTarget.content : '');
  
  // Default unlock date is tomorrow
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  const [unlockDate, setUnlockDate] = useState(editTarget ? editTarget.unlockDate : getTomorrowDateString());
  const [selectedMood, setSelectedMood] = useState(editTarget ? editTarget.mood : '😊');
  
  // Validation feedback
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tomorrow string for minimum date picker validation
  const minDateStr = getTomorrowDateString();

  const handleClear = () => {
    setTitle('');
    setContent('');
    setUnlockDate(getTomorrowDateString());
    setSelectedMood('😊');
    setValidationError(null);
  };

  const handleSave = () => {
    setValidationError(null);

    // Trim validation
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setValidationError('Please enter a descriptive letter title.');
      return;
    }
    if (!trimmedContent) {
      setValidationError('Write some thoughts first! Your future self is waiting.');
      return;
    }
    if (!unlockDate) {
      setValidationError('Please choose a valid unlock date.');
      return;
    }

    const pickedDate = new Date(unlockDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickedDate <= today) {
      setValidationError('Unlock date must be in the future (at least tomorrow).');
      return;
    }

    const currentLetters = loadLetters();

    if (editTarget) {
      // Edit mode
      const updated = currentLetters.map(l => {
        if (l.id === editTarget.id) {
          return {
            ...l,
            title: trimmedTitle,
            content: trimmedContent,
            unlockDate,
            mood: selectedMood,
          };
        }
        return l;
      });
      saveLetters(updated);
      setLetters(updated);
    } else {
      // Create mode
      const newLetter: Letter = {
        id: 'letter-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        unlockDate,
        mood: selectedMood,
        isOpened: false,
      };
      const updated = [newLetter, ...currentLetters];
      saveLetters(updated);
      setLetters(updated);
    }

    setSaveSuccess(true);
    setEditLetterId(null);

    setTimeout(() => {
      setView('letters');
    }, 1000);
  };

  const handleBack = () => {
    setEditLetterId(null);
    setView('letters');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6 transition-colors duration-200">
      
      {/* Back link */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors mb-6 cursor-pointer"
        id="back-to-letters-btn"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 sm:p-10 rounded-3xl shadow-xl shadow-neutral-100/50 dark:shadow-none"
      >
        <div className="flex justify-between items-start gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
              {editTarget ? 'Edit Your Future Letter' : 'Write Your Future Letter'}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1.5">
              Reflect on your current state, outline your goals, and seal them until the time comes.
            </p>
          </div>
          <div className="h-12 w-12 bg-brand-light-orange dark:bg-brand-dark-orange/20 rounded-2xl flex items-center justify-center text-2xl">
            ✍️
          </div>
        </div>

        {/* Validation notifications */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-semibold border border-red-100 dark:border-red-900/30"
            id="validation-error-box"
          >
            ⚠️ {validationError}
          </motion.div>
        )}

        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-sm font-semibold border border-green-100 dark:border-green-900/30 flex items-center gap-2"
            id="success-saved-box"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              ✨
            </motion.span>
            Letter sealed and locked successfully! Redirecting...
          </motion.div>
        )}

        {/* Form Body */}
        <div className="space-y-6">
          
          {/* Input: Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Letter Title
            </label>
            <input
              type="text"
              placeholder="e.g., Letter to my future self after graduating, Letter to Year 2030 Me"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden dark:text-neutral-100 transition-colors"
              maxLength={80}
              id="letter-title-input"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              <Clock size={12} className="text-brand-orange" />
              Unlock Date
            </label>
            <input
              type="date"
              min={minDateStr}
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden dark:text-neutral-100 transition-colors"
              id="letter-date-input"
            />
            <p className="text-[10px] text-neutral-400 mt-1">
              Until this date, the letter's content will be locked and hidden from view. Choose wisely.
            </p>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              How are you feeling today? (Current Mood)
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.emoji;
                return (
                  <button
                    key={m.emoji}
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-light-orange text-brand-orange border border-brand-orange shadow-xs dark:bg-brand-dark-orange/30'
                        : 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                    type="button"
                    id={`mood-btn-${m.emoji}`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Textarea */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Letter Content
              </label>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                {content.length.toLocaleString()} characters
              </span>
            </div>
            <textarea
              placeholder="Dear Future Self, today life is... I hope you have accomplished..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 p-4 text-sm focus:border-brand-orange focus:outline-hidden dark:text-neutral-100 transition-colors font-sans leading-relaxed resize-y"
              id="letter-content-textarea"
            />
          </div>

          {/* Actions panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleClear}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-xs font-bold text-neutral-500 hover:bg-neutral-150 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              type="button"
              id="clear-form-btn"
            >
              <Trash2 size={13} />
              Clear Fields
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-6 py-2.5 text-xs font-bold cursor-pointer"
                id="cancel-create-btn"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-orange-hover active:scale-95 transition-all cursor-pointer"
                id="save-letter-btn"
              >
                <Save size={13} />
                Sealed & Lock Letter
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
