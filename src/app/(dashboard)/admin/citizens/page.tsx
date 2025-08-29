import { listAdminCitizensAction } from "@/lib/actions/admin.actions";
import CitizensTable from "./_components/CitizensTable";

export default async function AdminCitizensPage() {
  const res = await listAdminCitizensAction();
  return <CitizensTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} />;
}
