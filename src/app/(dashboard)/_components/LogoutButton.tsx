"use client";

import * as React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { logoutAction, checkSessionAction } from "@/lib/actions/auth.actions";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const onLogout = React.useCallback(() => {
    startTransition(async () => {
      try {
        await logoutAction();
      } finally {
        router.replace("/login");
      }
    });
  }, [router]);

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

  return (
    <Button color="inherit" onClick={onLogout} disabled={pending}>
      {pending ? "Saindo..." : "Sair"}
    </Button>
  );
}

