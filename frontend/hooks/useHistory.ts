import { useState, useEffect } from 'react';
import { PredictionResponse } from '@/types/prediction';

export interface HistoryEntry {
  id: string;
  date: string;
  prediction: PredictionResponse;
  image: string; // Base64 data
}

const HISTORY_KEY = 'dermai_patient_history';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const addToHistory = (prediction: PredictionResponse, image: string) => {
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      date: new Date().toISOString(),
      prediction,
      image,
    };

    const updated = [newEntry, ...history].slice(0, 50); // Limit to last 50 entries
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newEntry.id;
  };

  const removeFromHistory = (id: string) => {
    const updated = history.filter((entry) => entry.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return { history, addToHistory, removeFromHistory, clearHistory };
};
