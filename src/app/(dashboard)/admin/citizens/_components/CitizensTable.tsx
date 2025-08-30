"use client";
import { DataGrid, GridColDef, GridValueGetter } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { createCitizenAction } from "@/lib/actions/admin.actions";
import React from "react";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import { useRouter } from "next/navigation";
import EditCitizenDialog from "./EditCitizenDialog";
import EmergencyContactsDialog from "./EmergencyContactsDialog";

type CitizenProfile = {
  name?: string;
  phone?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
};
type CitizenRow = { id: string; email: string; createdAt?: string; profile?: CitizenProfile };

export default function CitizensTable({ rows, error }: { rows: CitizenRow[]; error?: string }) {
  console.log(rows);
  useAuthRedirect(error);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [contactsOpen, setContactsOpen] = React.useState(false);
  const [selectedCitizen, setSelectedCitizen] = React.useState<CitizenRow | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "", phone: "" });
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  const safeSetOpen = React.useCallback((v:boolean)=>{ if (isMounted) setOpen(v); }, [isMounted]);
  const safeSetBusy = React.useCallback((v:boolean)=>{ if (isMounted) setBusy(v); }, [isMounted]);
  const columns: GridColDef<CitizenRow>[] = [
    { field: "email", headerName: "E-mail", flex: 1, minWidth: 220 },
    { field: "name", headerName: "Nome", flex: 1, minWidth: 160 },
    { field: "phone", headerName: "Telefone", flex: 1, minWidth: 140 },
    { field: "address", headerName: "Endereço", flex: 2, minWidth: 280 },
    { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
    { field: "actions", headerName: "Ações", sortable: false, flex: 1.2, minWidth: 220, renderCell: (p) => (
      <Stack direction="row" spacing={2}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => {
            setSelectedCitizen(p.row);
            setEditOpen(true);
          }}
        >
          Editar
        </Button>
        <Button
          size="small"
          startIcon={<ContactPhoneIcon />}
          onClick={() => {
            setSelectedCitizen(p.row);
            setContactsOpen(true);
          }}
        >
          Ver Contatos
        </Button>
      </Stack>
    )}
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon/>} onClick={()=>setOpen(true)}>Adicionar Cidadão</Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ height: 560, width: "100%" }}>
        {isMounted && (
          <DataGrid 
            rows={rows.map(row => ({
              ...row,
              name: row.profile?.name || '',
              phone: row.profile?.phone || '',
              address: (() => {
                const pr = row.profile || {};
                const line1 = [pr.street, pr.number].filter(Boolean).join(', ');
                const line2 = [pr.district, pr.city && pr.state ? `${pr.city} - ${pr.state}` : pr.city || pr.state].filter(Boolean).join(' · ');
                const line3 = pr.zip || '';
                return [line1, line2, line3].filter(Boolean).join(' • ');
              })()
            }))} 
            columns={columns} 
            getRowId={(r)=>r.id} 
            pageSizeOptions={[10,25,50]}
          />
        )}
      </Box>

      <Dialog open={open} onClose={()=>safeSetOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Cidadão</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="E-mail" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))} fullWidth />
            <TextField label="Senha" type="password" value={form.password} onChange={(e)=>setForm(f=>({...f, password: e.target.value}))} fullWidth />
            <TextField label="Telefone" value={form.phone} onChange={(e)=>setForm(f=>({...f, phone: e.target.value}))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>safeSetOpen(false)}>Cancelar</Button>
          <Button onClick={async ()=>{
            safeSetBusy(true);
            const r = await createCitizenAction({ email: form.email, password: form.password, phone: form.phone, roles: ["CITIZEN"] });
            safeSetBusy(false);
            if (!r.success) alert(r.error);
            else { safeSetOpen(false); router.refresh(); }
          }} variant="contained" disabled={busy || !form.email || !form.password}>Criar</Button>
        </DialogActions>
      </Dialog>
      
      <EditCitizenDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        citizen={selectedCitizen}
        onSuccess={() => router.refresh()}
      />
      
      <EmergencyContactsDialog
        open={contactsOpen}
        onClose={() => setContactsOpen(false)}
        citizenId={selectedCitizen?.id || ""}
        citizenName={selectedCitizen?.profile?.name}
      />
    </Box>
  );
}
