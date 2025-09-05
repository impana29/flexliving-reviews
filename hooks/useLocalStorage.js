import { useState, useEffect } from 'react';

function reviveReviewDates(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((r) => {
    // r may have isoDate or a date string — prefer isoDate
    if (r && r.isoDate) {
      try {
        return { ...r, date: new Date(r.isoDate) };
      } catch (e) {
        return { ...r, date: null };
      }
    }
    if (r && typeof r.date === 'string') {
      const d = new Date(r.date);
      return { ...r, date: isNaN(d.getTime()) ? null : d };
    }
    return r;
  });
}

export function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      if (typeof window === 'undefined') return initial;
      const raw = window.localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      return reviveReviewDates(parsed);
    } catch (e) {
      return initial;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // We store the state as-is; isoDate will remain a string if present
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (e) {
      // swallow localStorage errors
    }
  }, [key, state]);

  return [state, setState];
}
