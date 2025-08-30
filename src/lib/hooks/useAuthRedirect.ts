"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/contexts/ToastContext";

export function useAuthRedirect(error?: string) {
  const router = useRouter();
  const { show } = useToast();
  React.useEffect(() => {
    if (!error) return;
    const m = error.toLowerCase();
    if (m.includes('sessão expirada') || m.includes('sessao expirada') || m.includes('unauthorized') || m.includes('invalid token')) {
      show('Sua sessão expirou. Faça login novamente.', 'warning');
      router.replace('/login');
    }
  }, [error, router, show]);
}

