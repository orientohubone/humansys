import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const normalizeTheme = (value: string | null): Theme => {
  if (value === 'dark' || value === 'light' || value === 'auto') return value;
  // Backward compatibility with old settings value
  if (value === 'system') return 'auto';
  return 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Recupera tema salvo apenas no client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = normalizeTheme(localStorage.getItem('theme'));
        setTheme(savedTheme);
      } catch (error) {
        console.warn('Could not load theme from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const getActualTheme = (): 'light' | 'dark' => {
      if (theme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme === 'dark' ? 'dark' : 'light';
    };

    const newActualTheme = getActualTheme();
    setActualTheme(newActualTheme);

    document.documentElement.classList.toggle('dark', newActualTheme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setActualTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
