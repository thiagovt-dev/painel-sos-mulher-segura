import LoginForm from "./_components/LoginForm";
import { Box, Paper, Typography, Container } from "@mui/material";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function LoginPage() {
  const session = await getCurrentUser();
  console.log("session", session);
  if (session?.user.roles?.includes("ADMIN")) {
    redirect("/");
  }
  return (
    <Container maxWidth="xs" sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <Paper elevation={6} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography component="h1" variant="h5" fontWeight={700}>
            Entrar no painel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use seu e-mail e senha para continuar.
          </Typography>
        </Box>
        <LoginForm />
      </Paper>
    </Container>
  );
}
