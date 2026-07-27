/**
 * Streak math for the habit tracker.
 *
 * Kept as plain functions with no DB or React imports so they're trivial to
 * unit test and easy to reason about in an interview — pass in dates, get
 * numbers back.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Normalizes any Date to a UTC day-number (days since epoch), stripping time-of-day. */
function toDayNumber(date: Date): number {
  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return Math.floor(utcMidnight / MS_PER_DAY);
}

/** Rounds a Date down to UTC midnight — use this before writing a CheckIn.date to the DB. */
export function toDateOnlyUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Computes current + longest streak from a list of check-in dates.
 *
 * "Current streak" counts back from today. If today hasn't been checked in
 * yet, the streak isn't broken until the day actually ends — so we also
 * accept a streak that ends yesterday. It only resets to 0 once there's a
 * real gap (a day with no check-in that has fully passed).
 */
export function calculateStreaks(
  checkInDates: Date[],
  today: Date = new Date()
): StreakResult {
  if (checkInDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // De-dupe and sort ascending as day-numbers so consecutive days are a
  // simple "diff === 1" check, no calendar-month/leap-year edge cases.
  const dayNumbers = Array.from(new Set(checkInDates.map(toDayNumber))).sort(
    (a, b) => a - b
  );

  let longestStreak = 1;
  let runLength = 1;
  for (let i = 1; i < dayNumbers.length; i++) {
    if (dayNumbers[i] === dayNumbers[i - 1] + 1) {
      runLength += 1;
    } else {
      runLength = 1;
    }
    longestStreak = Math.max(longestStreak, runLength);
  }

  const todayNumber = toDayNumber(today);
  const mostRecent = dayNumbers[dayNumbers.length - 1];

  // Gap of more than 1 day between today and the last check-in means the
  // streak is already broken, regardless of how long it once was.
  if (todayNumber - mostRecent > 1) {
    return { currentStreak: 0, longestStreak };
  }

  // Walk backwards from the most recent check-in while days stay consecutive.
  let currentStreak = 1;
  for (let i = dayNumbers.length - 1; i > 0; i--) {
    if (dayNumbers[i] - dayNumbers[i - 1] === 1) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

/** Convenience check used by the UI to decide whether "Check in" or "Checked in" shows. */
export function isCheckedInToday(
  checkInDates: Date[],
  today: Date = new Date()
): boolean {
  const todayNumber = toDayNumber(today);
  return checkInDates.some((d) => toDayNumber(d) === todayNumber);
}
