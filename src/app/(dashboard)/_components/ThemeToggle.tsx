"use client";

import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useTheme();

  return (
    <Tooltip title={`Mudar para modo ${mode === 'light' ? 'escuro' : 'claro'}`}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        sx={{ ml: 1 }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
