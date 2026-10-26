import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('daymark-theme') || 'light';
    } catch (error) {
      console.error('Could not read the saved theme.', error);
      return 'light';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('daymark-theme', theme);
    } catch (error) {
      console.error('Could not save the selected theme.', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };
  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className="app-shell" data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside a ThemeProvider.');
  return context;
}
