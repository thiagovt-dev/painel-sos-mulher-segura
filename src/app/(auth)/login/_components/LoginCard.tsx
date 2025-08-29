"use client";

import { Paper } from "@mui/material";

interface LoginCardProps {
  children: React.ReactNode;
}

export default function LoginCard({ children }: LoginCardProps) {
  return (
    <Paper 
      elevation={8} 
      sx={{ 
        p: 4, 
        width: '100%', 
        borderRadius: 4,
        background: (theme) => 
          theme.palette.mode === 'light' 
            ? '#ffffff' 
            : '#1e1e1e',
        maxWidth: 400,
      }}
    >
      {children}
    </Paper>
  );
}
