import { listEmergencyContactsAction } from "@/lib/actions/emergency-contacts.actions";
import { Container } from "@mui/material";
import ContactsTable from "./_components/ContactsTable";

export default async function EmergencyContactsPage({ searchParams }: { searchParams: Promise<{ citizenId?: string }> }) {
  const { citizenId } = await searchParams;
  // Obs.: API atual lista contatos do usuário autenticado.
  // Se citizenId for informado, exibimos um aviso no componente.
  const res = await listEmergencyContactsAction();
  return (
    <Container maxWidth="lg">
      <ContactsTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} citizenId={citizenId} />
    </Container>
  );
}
