
import { useTheme as useNextTheme } from 'next-themes';

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme?: string;
  systemTheme?: string;
  themes: string[];
}

export const useTheme = (): ThemeState => {
  try {
    return useNextTheme();
  } catch (error) {
    console.error("Error using theme:", error);
    // Return fallback theme state to prevent the app from crashing
    return {
      theme: 'system',
      setTheme: () => console.warn("Theme setting not available"),
      themes: ['light', 'dark', 'system']
    };
  }
};

export default useTheme;
