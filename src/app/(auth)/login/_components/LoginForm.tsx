"use client";

import * as React from "react";
import { Alert, Button, Stack, TextField, FormControlLabel, Checkbox, InputAdornment, IconButton, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth.actions";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ThemeToggle from "@/app/(dashboard)/_components/ThemeToggle";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("maria@example.com");
  const [password, setPassword] = React.useState("minhasenha123");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
      <Stack spacing={5}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Login
          </Typography>
          <ThemeToggle />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Endereço de E-mail"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{mb: 5}}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          size="medium"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Lembrar de mim"
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 2, 
            mb: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        
        {/* <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
              Esqueceu a senha?
            </Link>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
              {"Não tem uma conta? Cadastre-se"}
            </Link>
          </Grid>
        </Grid> */}
      </Stack>
    </form>
  );
}
