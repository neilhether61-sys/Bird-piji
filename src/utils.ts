import { Letter } from './types';

// Storage Key
const STORAGE_KEY = 'future_letters_data';

// Helper to get letters from localStorage
export function loadLetters(): Letter[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load letters from localStorage:', error);
    return [];
  }
}

// Helper to save letters to localStorage
export function saveLetters(letters: Letter[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  } catch (error) {
    console.error('Failed to save letters to localStorage:', error);
  }
}

// Helper to get time difference and countdown info
export interface CountdownInfo {
  isPast: boolean;
  totalDays: number;
  years: number;
  months: number;
  days: number;
  text: string;
}

export function getCountdown(unlockDateStr: string, currentDateStr?: string): CountdownInfo {
  const targetDate = new Date(unlockDateStr + 'T23:59:59'); // Set to end of unlock day
  const now = currentDateStr ? new Date(currentDateStr) : new Date();
  
  // Set time of both dates to midnight for accurate day calculations
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = targetMidnight.getTime() - nowMidnight.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) {
    return {
      isPast: true,
      totalDays: 0,
      years: 0,
      months: 0,
      days: 0,
      text: 'Ready to read',
    };
  }

  // Calculate breakdown
  let years = targetMidnight.getFullYear() - nowMidnight.getFullYear();
  let months = targetMidnight.getMonth() - nowMidnight.getMonth();
  let days = targetMidnight.getDate() - nowMidnight.getDate();

  if (days < 0) {
    months -= 1;
    // Get number of days in the previous month
    const prevMonth = new Date(targetMidnight.getFullYear(), targetMidnight.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Generate elegant text description
  let text = '';
  if (years > 0) {
    text += `${years} Year${years > 1 ? 's' : ''}`;
    if (months > 0) text += `, ${months} Month${months > 1 ? 's' : ''}`;
  } else if (months > 0) {
    text += `${months} Month${months > 1 ? 's' : ''}`;
    if (days > 0) text += `, ${days} Day${days > 1 ? 's' : ''}`;
  } else {
    text += `${totalDays} Day${totalDays > 1 ? 's' : ''}`;
  }

  return {
    isPast: false,
    totalDays,
    years,
    months,
    days,
    text: `${text} Remaining`,
  };
}

// Generate demo letters
export function generateDemoLetters(): Letter[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const future1 = new Date();
  future1.setDate(future1.getDate() + 14); // 2 weeks
  const future1Str = future1.toISOString().split('T')[0];

  const future2 = new Date();
  future2.setFullYear(future2.getFullYear() + 5); // 5 years
  const future2Str = future2.toISOString().split('T')[0];

  return [
    {
      id: 'demo-unlocked-1',
      title: 'A gentle reminder to slow down',
      content: `Dear Self,

If you are reading this, it means you successfully set up Future Letter and waited!

How is life treating you today? Are you taking deep breaths? Are you getting enough sleep? 

I wrote this brief letter to remind you of what matters. Remember to call your parents, drink some water, and don't take your day-to-day stresses too seriously. Everything is passing, including this very moment.

Keep smiling,
Your past self from yesterday.`,
      createdAt: yesterday.toISOString(),
      unlockDate: yesterdayStr,
      mood: '😌',
      isOpened: false,
    },
    {
      id: 'demo-locked-1',
      title: 'Notes for the near-future version of me',
      content: `Hey there! 

By the time you open this, two weeks have passed. I wanted to see if you finally finished that project or if you are still putting it off. 

Either way, hope you are feeling motivated today. Take five minutes to celebrate your progress. 

Cheers!`,
      createdAt: new Date().toISOString(),
      unlockDate: future1Str,
      mood: '😄',
      isOpened: false,
    },
    {
      id: 'demo-locked-2',
      title: 'To myself in 5 years (Year 2031)',
      content: `Hello from five years in the past!

Right now, I am sitting down writing this, thinking about how fast time flies. By the time you read this, so much will have changed. 

Where are you living? What are you doing for work? Did you make that trip we always dreamed about? Are the people we love still close by?

I hope you are healthy, kind to yourself, and still curious about the world. Don't forget your roots, and don't stop dreaming.

With absolute love and hope,
Me from 2026.`,
      createdAt: new Date().toISOString(),
      unlockDate: future2Str,
      mood: '😊',
      isOpened: false,
    }
  ];
}
