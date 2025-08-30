"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    // Recuperar preferência salva do localStorage
    const savedMode = localStorage.getItem('theme-mode') as PaletteMode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
        light: mode === 'light' ? '#42a5f5' : '#e3f2fd',
        dark: mode === 'light' ? '#1565c0' : '#42a5f5',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
        light: mode === 'light' ? '#ff5983' : '#fce4ec',
        dark: mode === 'light' ? '#9a0036' : '#c2185b',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#1a2027' : '#ffffff',
        secondary: mode === 'light' ? '#637381' : '#aab4be',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        defaultProps: { variant: "contained" },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 500,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'light' 
                ? '0 4px 12px rgba(0,0,0,0.15)' 
                : '0 4px 12px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
            borderRadius: 16,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            borderRadius: 12,
            '& .MuiDataGrid-cell': {
              borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2d2d2d',
              borderBottom: mode === 'light' ? '2px solid #e0e0e0' : '2px solid #333',
              borderRadius: '12px 12px 0 0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: mode === 'light' ? '#f8f9fa' : '#2a2a2a',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            color: mode === 'light' ? '#1a2027' : '#ffffff',
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.12)' 
              : '0 1px 3px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            borderRadius: '50%',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            marginBottom: 4,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': {
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.15)' 
              : '0 4px 20px rgba(0,0,0,0.4)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.875rem',
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiSnackbarContent-root': {
              borderRadius: 12,
            },
          },
        },
      },
    },
  });

  // Adicionar estilos globais para scrollbars personalizados
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: ${mode === 'light' ? '#f1f1f1' : '#2a2a2a'};
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: ${mode === 'light' ? '#c1c1c1' : '#555'};
        border-radius: 4px;
        transition: background 0.3s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: ${mode === 'light' ? '#a8a8a8' : '#777'};
      }
      
      ::-webkit-scrollbar-corner {
        background: ${mode === 'light' ? '#f1f1f1' : '#2a2a2a'};
      }
      
      /* Para Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: ${mode === 'light' ? '#c1c1c1 #f1f1f1' : '#555 #2a2a2a'};
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
