"use client";

import { Box } from "@mui/material";

interface LoginBackgroundProps {
  children: React.ReactNode;
}

export default function LoginBackground({ children }: LoginBackgroundProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => 
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            : 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}
