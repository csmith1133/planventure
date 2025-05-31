import { createTheme, ThemeProvider } from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ toggleColorMode: () => {} });

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'dark'
  );

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
