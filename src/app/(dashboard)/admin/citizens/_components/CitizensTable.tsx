"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Link as MuiLink } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { createCitizenAction } from "@/lib/actions/admin.actions";
import Link from "next/link";
import React from "react";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

type CitizenRow = { id: string; email: string; phone?: string; createdAt?: string };

export default function CitizensTable({ rows, error }: { rows: CitizenRow[]; error?: string }) {
  useAuthRedirect(error);
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "", phone: "" });
  const columns: GridColDef<CitizenRow>[] = [
    { field: "email", headerName: "E-mail", flex: 1, minWidth: 220 },
    { field: "phone", headerName: "Telefone", flex: 1, minWidth: 140 },
    { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
    { field: "actions", headerName: "Ações", sortable: false, flex: 1.2, minWidth: 220, renderCell: (p) => (
      <Stack direction="row" spacing={2}>
        <MuiLink component={Link} href={`/emergency-contacts?citizenId=${p.row.id}`}>Ver Contatos</MuiLink>
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
        <DataGrid 
          rows={rows} 
          columns={columns} 
          getRowId={(r)=>r.id} 
          pageSizeOptions={[10,25,50]}
        />
      </Box>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Cidadão</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="E-mail" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))} fullWidth />
            <TextField label="Senha" type="password" value={form.password} onChange={(e)=>setForm(f=>({...f, password: e.target.value}))} fullWidth />
            <TextField label="Telefone" value={form.phone} onChange={(e)=>setForm(f=>({...f, phone: e.target.value}))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button onClick={async ()=>{
            setBusy(true);
            const r = await createCitizenAction({ email: form.email, password: form.password, phone: form.phone, roles: ["CITIZEN"] });
            setBusy(false);
            if (!r.success) alert(r.error);
            else { setOpen(false); window.location.reload(); }
          }} variant="contained" disabled={busy || !form.email || !form.password}>Criar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
