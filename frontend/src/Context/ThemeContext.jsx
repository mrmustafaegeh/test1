import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themes = ["pastel", "synthwave"];
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to first theme
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || themes[0];
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === themes[0] ? themes[1] : themes[0]));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
