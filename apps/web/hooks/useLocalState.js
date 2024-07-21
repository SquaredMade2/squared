import { useState, useEffect } from 'react';

/* eslint-disable */
export const useLocalState = (key, initial) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    return initial;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);
  return [value, setValue];
};
