import { useState, useEffect } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'claude-recall-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'system' || stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (e) {
    console.warn('Failed to read theme preference from localStorage:', e);
  }
  return 'system';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  // Force dark mode only
  return 'dark';
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(getStoredPreference);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getStoredPreference())
  );

  // Update resolved theme when preference changes
  useEffect(() => {
    const newResolvedTheme = resolveTheme(preference);
    setResolvedTheme(newResolvedTheme);
    document.documentElement.setAttribute('data-theme', newResolvedTheme);
  }, [preference]);

  // Force dark mode - no system theme listening needed

  const setThemePreference = (newPreference: ThemePreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, newPreference);
      setPreference(newPreference);
    } catch (e) {
      console.warn('Failed to save theme preference to localStorage:', e);
      // Still update the theme even if localStorage fails
      setPreference(newPreference);
    }
  };

  return {
    preference,
    resolvedTheme,
    setThemePreference
  };
}
