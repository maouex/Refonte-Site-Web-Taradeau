import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations } from '../data/translations';

const STORAGE_KEY = 'taradeau-language';
const DEFAULT_LANGUAGE = 'fr';

const LanguageContext = createContext(null);

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored;
    }
  } catch {
    // localStorage unavailable (SSR, privacy mode, etc.)
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((lang) => {
    if (!translations[lang]) return;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const t = useCallback(
    (key) => {
      const value = translations[language]?.[key];
      if (value !== undefined) return value;
      // Fallback to French, then return the key itself
      const fallback = translations[DEFAULT_LANGUAGE]?.[key];
      if (fallback !== undefined) return fallback;
      return key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
