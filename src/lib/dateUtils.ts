/**
 * Returns the local date string in YYYY-MM-DD format,
 * avoiding timezone offset issues that occur with toISOString().
 */
export function getLocalDateString(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
}

/**
 * Calculates the current streak based on an array of completed date strings (YYYY-MM-DD).
 */
export function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;

  // Sort dates descending (newest first) and remove duplicates
  const sortedDates = [...new Set(completedDates)].sort().reverse();
  const today = getLocalDateString();
  const yesterday = getLocalDateString(new Date(Date.now() - 86400000));

  let streak = 0;

  // If the most recent completion is neither today nor yesterday, streak is broken
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  // Start counting backwards from the most recent completion
  let currentDate = new Date(sortedDates[0]);

  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    const expectedDateStr = getLocalDateString(currentDate);

    if (dateStr === expectedDateStr) {
      streak++;
      // Move to the previous day
      currentDate = new Date(currentDate.getTime() - 86400000);
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}

/**
 * Parses a Korean time string like "오전 09:00" or "오후 10:30" into hours (24h format) and minutes.
 */
export function parseKoreanTime(timeStr: string): { hours: number, minutes: number } | null {
  try {
    const parts = timeStr.split(' ');
    if (parts.length !== 2) return null;
    
    const ampm = parts[0];
    const time = parts[1];
    
    let [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return null;

    if (ampm === '오후' && hours < 12) {
      hours += 12;
    } else if (ampm === '오전' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  } catch (e) {
    return null;
  }
}
export function calculateWeeklyProgress(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const today = new Date();
  let count = 0;
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    if (completedDates.includes(getLocalDateString(d))) {
      count++;
    }
  }
  
  return Math.round((count / 7) * 100);
}
