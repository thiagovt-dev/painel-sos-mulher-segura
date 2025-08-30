import { listEmergencyContactsAction, listCitizenEmergencyContactsAction } from "@/lib/actions/emergency-contacts.actions";
import { Container } from "@mui/material";
import ContactsTable from "./_components/ContactsTable";

export default async function EmergencyContactsPage({ searchParams }: { searchParams: Promise<{ citizenId?: string }> }) {
  const { citizenId } = await searchParams;
  
  let res;
  if (citizenId) {
    res = await listCitizenEmergencyContactsAction(citizenId);
  } else {
    res = await listEmergencyContactsAction();
  }
  
  return (
    <Container maxWidth="lg">
      <ContactsTable 
        rows={res.success ? res.data! : []} 
        error={res.success ? undefined : res.error} 
        citizenId={citizenId} 
      />
    </Container>
  );
}
