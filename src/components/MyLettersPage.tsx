import React, { useState } from 'react';
import { ViewType, Letter, FilterStatus, SortType } from '../types';
import { Search, Plus, Trash2, Edit, Mail, Lock, Unlock, Calendar, Clock, AlertTriangle, Check, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCountdown, saveLetters } from '../utils';

interface MyLettersPageProps {
  letters: Letter[];
  setLetters: (letters: Letter[]) => void;
  setView: (view: ViewType) => void;
  setSelectedLetterId: (id: string | null) => void;
  setEditLetterId: (id: string | null) => void;
}

export default function MyLettersPage({
  letters,
  setLetters,
  setView,
  setSelectedLetterId,
  setEditLetterId
}: MyLettersPageProps) {
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortType, setSortType] = useState<SortType>('newest');

  // Confirmation of deletion
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Calculate progress of time remaining
  const calculateProgress = (createdAt: string, unlockDate: string): number => {
    try {
      const created = new Date(createdAt).getTime();
      const unlock = new Date(unlockDate + 'T23:59:59').getTime();
      const now = Date.now();
      
      if (now >= unlock) return 100;
      if (now <= created) return 0;
      
      const total = unlock - created;
      const elapsed = now - created;
      return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
    } catch (e) {
      return 0;
    }
  };

  const handleDelete = (id: string) => {
    const updated = letters.filter(l => l.id !== id);
    setLetters(updated);
    saveLetters(updated);
    setDeleteConfirmId(null);
  };

  const handleEditClick = (letter: Letter, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditLetterId(letter.id);
    setView('write');
  };

  const handleOpenClick = (letter: Letter) => {
    const countdown = getCountdown(letter.unlockDate);
    if (!countdown.isPast) return; // Locked!
    
    setSelectedLetterId(letter.id);
    setView('open-letter');
  };

  // Filter & Sort Logic
  const filteredLetters = letters
    .filter(letter => {
      // 1. Search Query
      const matchesSearch = letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            letter.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Status Filter
      const countdown = getCountdown(letter.unlockDate);
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'locked' && !countdown.isPast) ||
                            (statusFilter === 'unlocked' && countdown.isPast);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 3. Sort Filter
      if (sortType === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortType === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortType === 'unlockSoon') {
        // Compare remaining time to unlock (unlocked items go to the end/front accordingly)
        const aDiff = new Date(a.unlockDate).getTime() - Date.now();
        const bDiff = new Date(b.unlockDate).getTime() - Date.now();
        return aDiff - bDiff;
      }
      return 0;
    });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 transition-colors duration-200">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-6 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            My Time Capsules
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Manage your past thoughts, locked secrets, and future reminders.
          </p>
        </div>
        <button
          onClick={() => setView('write')}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white hover:bg-brand-orange-hover hover:scale-[1.02] active:scale-95 transition-all cursor-pointer self-start sm:self-center"
          id="add-new-letter-dashboard-btn"
        >
          <Plus size={16} />
          Create New Letter
        </button>
      </div>

      {letters.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-neutral-50/50 dark:bg-neutral-900/10 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 max-w-xl mx-auto"
          id="empty-state-container"
        >
          {/* Animated Orange Envelope Illustration */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 2, 0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative bg-brand-light-orange dark:bg-brand-dark-orange/20 h-24 w-32 border-2 border-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange text-4xl"
            >
              ✉️
              <div className="absolute top-0 inset-x-0 h-1/2 border-b border-dashed border-brand-orange/30" />
            </motion.div>
          </div>
          <h3 className="font-display font-extrabold text-xl text-neutral-800 dark:text-neutral-200">No letters yet</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs mx-auto mt-2.5">
            Start writing your future today. Create a message for yourself to unlock later.
          </p>
          <button
            onClick={() => setView('write')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-orange-hover shadow-sm active:scale-95 transition-all cursor-pointer"
            id="empty-state-write-btn"
          >
            <Plus size={14} />
            Write Your First Letter
          </button>
        </motion.div>
      ) : (
        /* Filters + Letter Cards Grid */
        <div className="space-y-8">
          
          {/* Search and Filters panel */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search letters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-brand-orange focus:outline-hidden dark:text-neutral-100 transition-colors"
                id="letters-search-input"
              />
            </div>

            {/* Filter Tabs & Sort Select */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filters */}
              <div className="flex bg-neutral-100/60 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200/40 dark:border-neutral-800">
                {(['all', 'locked', 'unlocked'] as FilterStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-white dark:bg-neutral-900 text-brand-orange shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                    id={`filter-btn-${st}`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 focus:border-brand-orange focus:outline-hidden transition-colors cursor-pointer"
                id="letters-sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="unlockSoon">Unlocking Soonest</option>
              </select>
            </div>

          </div>

          {/* Letters Grid */}
          {filteredLetters.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl" id="no-filtered-results">
              No letters match your current filters or search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredLetters.map((letter) => {
                  const countdown = getCountdown(letter.unlockDate);
                  const progressVal = calculateProgress(letter.createdAt, letter.unlockDate);
                  const isConfirmingDelete = deleteConfirmId === letter.id;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={letter.id}
                      className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-brand-orange/15 dark:hover:border-brand-orange/25 transition-all flex flex-col justify-between"
                      id={`letter-card-${letter.id}`}
                    >
                      <div>
                        {/* Upper Badges & Icon row */}
                        <div className="flex items-center justify-between mb-4.5">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-2xl group-hover:scale-110 transition-transform">
                            {letter.mood}
                          </div>
                          
                          {/* Locked/Unlocked Badge */}
                          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            countdown.isPast
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                              : 'bg-brand-light-orange text-brand-orange dark:bg-brand-dark-orange/20 dark:text-brand-orange border border-brand-orange/10'
                          }`}>
                            {countdown.isPast ? (
                              <>
                                <Unlock size={10} className="stroke-[2.5]" />
                                <span>Unlocked</span>
                              </>
                            ) : (
                              <>
                                <Lock size={10} className="stroke-[2.5]" />
                                <span>Locked</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-1 leading-tight group-hover:text-brand-orange transition-colors">
                          {letter.title}
                        </h3>

                        {/* Created & Unlock Calendar */}
                        <div className="flex flex-col gap-1 text-[11px] text-neutral-400 dark:text-neutral-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar size={11} />
                            <span>Written: {new Date(letter.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-neutral-500 dark:text-neutral-400">
                            <Clock size={11} className="text-brand-orange" />
                            <span>Opens: {new Date(letter.unlockDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          </div>
                        </div>

                        {/* Countdown text / Status */}
                        <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-150/40 dark:border-neutral-800 mb-4">
                          <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5 font-bold">Status Capsule</span>
                          <span className={`font-mono text-sm font-bold ${
                            countdown.isPast ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-800 dark:text-neutral-200'
                          }`}>
                            {countdown.text}
                          </span>
                        </div>

                        {/* Orange progress bar */}
                        <div className="space-y-1 mb-6">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                            <span>Sealing Progress</span>
                            <span>{progressVal}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-brand-orange"
                              initial={{ width: 0 }}
                              animate={{ width: `${progressVal}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons panel */}
                      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex items-center justify-between gap-2">
                        
                        {/* Delete & Edit or Confirm Panel */}
                        {isConfirmingDelete ? (
                          <div className="flex items-center justify-between w-full bg-red-50 dark:bg-red-950/20 p-2 rounded-xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs">
                            <span className="font-semibold flex items-center gap-1">
                              <AlertTriangle size={13} /> Delete?
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md font-bold hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-all cursor-pointer"
                              >
                                No
                              </button>
                              <button
                                onClick={() => handleDelete(letter.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-all cursor-pointer"
                                id={`confirm-delete-btn-${letter.id}`}
                              >
                                Yes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Left actions: Delete / Edit */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setDeleteConfirmId(letter.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                                aria-label="Delete letter"
                                id={`delete-letter-btn-${letter.id}`}
                              >
                                <Trash2 size={16} />
                              </button>
                              <button
                                onClick={(e) => handleEditClick(letter, e)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer border border-transparent hover:border-neutral-150"
                                aria-label="Edit letter"
                                id={`edit-letter-btn-${letter.id}`}
                              >
                                <Edit size={16} />
                              </button>
                            </div>

                            {/* Open CTA on right */}
                            <button
                              disabled={!countdown.isPast}
                              onClick={() => handleOpenClick(letter)}
                              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                countdown.isPast
                                  ? 'bg-brand-orange text-white shadow-sm hover:bg-brand-orange-hover hover:scale-[1.02] active:scale-95'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed border border-neutral-150/50 dark:border-neutral-700/50'
                              }`}
                              id={`open-letter-btn-${letter.id}`}
                            >
                              {countdown.isPast ? 'Open Letter' : 'Locked'}
                            </button>
                          </>
                        )}

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
