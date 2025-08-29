"use client";

import * as React from "react";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { logoutAction, checkSessionAction } from "@/lib/actions/auth.actions";

interface LogoutButtonProps {
  variant?: 'button' | 'text';
  onLogout?: () => void;
}

export default function LogoutButton({ variant = 'button', onLogout }: LogoutButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const handleLogout = React.useCallback(() => {
    startTransition(async () => {
      try {
        await logoutAction();
        // Chama o callback se fornecido (para fechar o menu)
        if (onLogout) {
          onLogout();
        }
      } finally {
        router.replace("/login");
      }
    });
  }, [router, onLogout]);

  // Auto-logout: ping server periodically to ensure session is valid
  React.useEffect(() => {
    let active = true;
    async function ping() {
      try {
        const res = await checkSessionAction();
        if (!res?.success && active) router.replace("/login");
      } catch {
        if (active) router.replace("/login");
      }
    }
    ping();
    const id = setInterval(ping, 60_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [router]);

  if (variant === 'text') {
    return (
      <Typography 
        variant="body2" 
        onClick={handleLogout}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        {pending ? "Saindo..." : "Sair"}
      </Typography>
    );
  }

  return (
    <Button color="secondary" variant="contained" onClick={handleLogout} disabled={pending}>
      {pending ? "Saindo..." : "Sair"}
    </Button>
  );
}

