import { listAdminUsersAction } from "@/lib/actions/admin.actions";
import UsersTable from "./_components/UsersTable";

export default async function AdminUsersPage() {
  const res = await listAdminUsersAction();
  return <UsersTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} />;
}
