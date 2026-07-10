import React, { useState, useRef } from 'react';
import { ViewType, Letter } from '../types';
import { Download, Upload, Trash2, ShieldCheck, Sun, Moon, Info, HelpCircle, FileText, Check, AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';
import { saveLetters, loadLetters } from '../utils';

interface SettingsPageProps {
  letters: Letter[];
  setLetters: (letters: Letter[]) => void;
  setView: (view: ViewType) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function SettingsPage({
  letters,
  setLetters,
  setView,
  darkMode,
  setDarkMode
}: SettingsPageProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [importDragActive, setImportDragActive] = useState(false);

  // Export Letters Handler
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(letters, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `future_letters_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Failed to export letters:', error);
    }
  };

  // Safe Import parser
  const processImportedData = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Imported file must contain a valid list of letters.');
      }

      // Basic structure validation
      const validLetters: Letter[] = [];
      parsed.forEach((item: any, idx) => {
        if (typeof item === 'object' && item !== null && item.title && item.content && item.unlockDate) {
          validLetters.push({
            id: item.id || `imported-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
            title: String(item.title),
            content: String(item.content),
            createdAt: String(item.createdAt || new Date().toISOString()),
            unlockDate: String(item.unlockDate),
            mood: String(item.mood || '😊'),
            isOpened: Boolean(item.isOpened)
          });
        }
      });

      if (validLetters.length === 0) {
        throw new Error('No valid letters found in the JSON file.');
      }

      // Merge with existing letters by avoiding duplicate IDs
      const current = loadLetters();
      const merged = [...current];
      
      let addedCount = 0;
      validLetters.forEach(importedLetter => {
        if (!merged.some(existing => existing.id === importedLetter.id)) {
          merged.push(importedLetter);
          addedCount++;
        }
      });

      saveLetters(merged);
      setLetters(merged);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${addedCount} new letters! (Total: ${merged.length} letters)`
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setImportStatus({
        type: 'error',
        message: error.message || 'Failed to parse JSON file. Ensure it is a valid Future Letter export file.'
      });
    }
  };

  // File Selector Import Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        processImportedData(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  // Drag and Drop Import Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setImportDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setImportDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImportDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        processImportedData(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  // Delete All Handler
  const handleDeleteAll = () => {
    saveLetters([]);
    setLetters([]);
    setShowDeleteAllConfirm(false);
    setImportStatus({
      type: 'success',
      message: 'All letters have been permanently deleted.'
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6 transition-colors duration-200">
      
      {/* Title */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6 mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          Back up, restore, and manage your private sandbox container data.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Status banner */}
        {importStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
              importStatus.type === 'success'
                ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30'
                : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'
            }`}
          >
            {importStatus.type === 'success' ? '✨' : '⚠️'}
            <span>{importStatus.message}</span>
          </motion.div>
        )}

        {/* Card: Export & Import Backup */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-2">
            <Download size={18} className="text-brand-orange" />
            Backup & Migration
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-6">
            Since your letters are stored completely locally in your browser's private localStorage sandbox, they can be lost if you clear your browser history or cache. We highly recommend downloading a secure backup file periodically.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            
            {/* Export block */}
            <div className="border border-neutral-150/60 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 mb-1">Export Letters</h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                  Download all your current {letters.length} letters as a structured JSON backup file to your computer.
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={letters.length === 0}
                className={`mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  letters.length > 0
                    ? 'bg-brand-orange text-white hover:bg-brand-orange-hover'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed border border-neutral-200/40 dark:border-neutral-700/40'
                }`}
                id="export-backup-btn"
              >
                <Download size={14} />
                Download JSON Backup
              </button>
            </div>

            {/* Import block */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border p-5 rounded-2xl flex flex-col justify-between transition-all ${
                importDragActive 
                  ? 'border-brand-orange bg-brand-light-orange/30 dark:bg-brand-dark-orange/10' 
                  : 'border-dashed border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div>
                <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 mb-1">Import Backup</h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                  Drag and drop your Future Letter JSON file here, or click to upload and merge backup with your local letters.
                </p>
              </div>

              <div className="mt-5">
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-850 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 px-4 py-2.5 text-xs font-bold cursor-pointer"
                  id="import-backup-btn"
                >
                  <Upload size={14} />
                  Choose File
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Card: Preferences */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-6">
            <Sun size={18} className="text-brand-orange" />
            Preferences
          </h3>

          <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Dark Mode Colorway</h4>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Toggle high-contrast twilight colors for eye strain comfort.</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-16 items-center rounded-full bg-neutral-100 dark:bg-neutral-800 p-1 transition-colors cursor-pointer"
              id="preferences-dark-toggle"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-neutral-950 shadow-sm transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}>
                {darkMode ? <Moon size={14} className="text-amber-400" /> : <Sun size={14} className="text-brand-orange" />}
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Reset Presets</h4>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Re-load default demo time capsules to test layout features.</p>
            </div>
            <button
              onClick={() => {
                const current = loadLetters();
                const demos = [
                  {
                    id: 'demo-unlocked-1',
                    title: 'A gentle reminder to slow down',
                    content: `Dear Self,

If you are reading this, it means you successfully set up Future Letter and waited!

How is life treating you today? Are you taking deep breaths? Are you getting enough sleep? 

I wrote this brief letter to remind you of what matters. Remember to call your parents, drink some water, and don't take your day-to-day stresses too seriously. Everything is passing, including this very moment.

Keep smiling,
Your past self from yesterday.`,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    unlockDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    mood: '😌',
                    isOpened: false,
                  }
                ];
                // merge with duplicates safety
                const merged = [...current];
                demos.forEach(d => {
                  if (!merged.some(x => x.id === d.id)) merged.push(d);
                });
                saveLetters(merged);
                setLetters(merged);
                setImportStatus({
                  type: 'success',
                  message: 'Demo capsule successfully loaded into dashboard!'
                });
              }}
              className="rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-800 px-4 py-2 text-xs font-bold cursor-pointer"
              id="settings-reset-demo-btn"
            >
              Load Demo
            </button>
          </div>

        </div>

        {/* Card: Danger Zone */}
        <div className="bg-red-50/20 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 sm:p-8">
          <h3 className="font-display font-bold text-lg text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
            <Trash2 size={18} />
            Danger Zone
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-6">
            Permanent, non-reversible actions regarding your local browser records. Be absolutely careful.
          </p>

          {showDeleteAllConfirm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-neutral-900 border border-red-100 dark:border-red-900/40 p-5 rounded-2xl text-center"
            >
              <AlertOctagon size={32} className="text-red-500 mx-auto mb-3" />
              <h4 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">Are you absolutely sure?</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1.5 leading-relaxed max-w-sm mx-auto">
                This will instantly wipe your {letters.length} capsules from this browser. This operation cannot be undone. We suggest exporting your data first.
              </p>
              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="rounded-full bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 px-5 py-2 text-xs font-bold cursor-pointer"
                  id="cancel-wipe-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-xs font-bold cursor-pointer"
                  id="confirm-wipe-btn"
                >
                  Yes, Wipe All Data
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-neutral-850 dark:text-neutral-200">Delete All Letters</h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Wipe all sealed records from local browser memory completely.</p>
              </div>
              <button
                onClick={() => setShowDeleteAllConfirm(true)}
                disabled={letters.length === 0}
                className={`rounded-full px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  letters.length > 0
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed border border-neutral-200/40 dark:border-neutral-700/40'
                }`}
                id="trigger-wipe-confirm-btn"
              >
                <Trash2 size={13} />
                Delete All Data
              </button>
            </div>
          )}
        </div>

        {/* Card: About / Legal block */}
        <div className="bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 flex items-start gap-4" id="about-legal-section">
          <div className="p-2.5 bg-brand-light-orange text-brand-orange dark:bg-brand-dark-orange/20 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Privacy & Security Promise</h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 leading-relaxed">
              Future Letter is an entirely static, offline-first client-side experience. There are no registration trackers, cookies, marketing analytics, database clusters, or external API relays attached. Your thoughts remain completely yours, stored locally on your device, private and secure forever.
            </p>
            <div className="flex gap-4 mt-4 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              <span>App Version: v1.2.0-private</span>
              <span>•</span>
              <span>Licensing: Apache-2.0</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
