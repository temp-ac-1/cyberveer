import React, { createContext, useContext, useState, useEffect } from 'react';

export const themes = [
  { name: 'light', label: 'Default Light', description: 'Clean and elegant base theme', icon: '☀️' },
  { name: 'dark', label: 'Dark', description: 'Ideal for night study sessions', icon: '🌚' },
  { name: 'cyber', label: 'Cyber Neon', description: 'Futuristic neon vibe for a cyberpunk feel', icon: '🧪' },
  { name: 'sunset', label: 'Sunset', description: 'Warm and comforting, good for creative themes', icon: '🌅' },
  { name: 'forest', label: 'Forest', description: 'Calm, focused, great for study environments', icon: '🌿' },
  { name: 'academic', label: 'Academic Blue', description: 'A formal and trustworthy look — perfect for education', icon: '📘' },
  { name: 'icy', label: 'Icy', description: 'Cool, clean, and modern', icon: '🧊' },
  { name: 'pastel', label: 'Pastel Dream', description: 'Playful and fun – could be used for onboarding or gamified features', icon: '🦄' },
  { name: 'midnight', label: 'Midnight', description: 'Dark with deep tones – sleek and stylish', icon: '🌌' },
  { name: 'mono', label: 'Monochrome', description: 'Minimalist theme for focused reading/study environments', icon: '⚙️' },
];

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('cyberveer-theme');
      return saved && themes.find(t => t.name === saved) ? saved : 'cyber';
    } catch {
      return 'cyber';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    try { localStorage.setItem('cyberveer-theme', currentTheme); } catch {}
  }, [currentTheme]);

  const setTheme = (theme) => {
    setCurrentTheme(theme);
  };

  const getTheme = (name) => {
    return themes.find(t => t.name === name) || themes[0];
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, getTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
