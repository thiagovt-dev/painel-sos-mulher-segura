import LoginForm from "./_components/LoginForm";
import { Box, Typography, Container, Avatar } from "@mui/material";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import LoginBackground from "./_components/LoginBackground";
import LoginCard from "./_components/LoginCard";

export default async function LoginPage() {
  const session = await getCurrentUser();
  console.log("session", session);
  if (session?.user.roles?.includes("ADMIN")) {
    redirect("/");
  }
  return (
    <LoginBackground>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            src="/logo.jpeg"
            alt="Logo"
            sx={{ width: 80, height: 80, mb: 2 }}
            variant="rounded"
          />
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Central Administrativa
          </Typography>
          <LoginCard>
            <LoginForm />
          </LoginCard>
        </Box>
      </Container>
    </LoginBackground>
  );
}
