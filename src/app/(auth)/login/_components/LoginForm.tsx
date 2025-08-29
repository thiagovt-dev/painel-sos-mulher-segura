"use client";

import * as React from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth.actions";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("maria@example.com");
  const [password, setPassword] = React.useState("minhasenha123");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await loginAction({ email, password });
    setLoading(false);
    if (!res.success) return setError(res.error || "Falha no login");
    router.replace("/");
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          fullWidth
          required
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          fullWidth
          required
        />
        <Button type="submit" size="large" fullWidth disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </Stack>
    </form>
  );
}
