import { listAdminUsersAction } from "@/lib/actions/admin.actions";
import UsersTable from "./_components/UsersTable";
import { Container } from "@mui/material";

export default async function AdminUsersPage() {
  const res = await listAdminUsersAction();
  return (
    <Container maxWidth="xl">
      <UsersTable 
        rows={res.success ? res.data! : []} 
        error={res.success ? undefined : res.error} 
      />
    </Container>
  );
}
