"use client";
import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography, IconButton, Snackbar, Paper } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEmergencyContactAction, updateEmergencyContactAction } from "@/lib/actions/emergency-contacts.actions";
import type { EmergencyContact } from "@/types/emergency-contacts.interface";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

type Props = { rows: EmergencyContact[]; error?: string; citizenId?: string };

export default function ContactsTable({ rows, error, citizenId }: Props) {
  useAuthRedirect(error);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<EmergencyContact | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", phone: "", relation: "", priority: 0, isFavorite: false });
  const [localError, setLocalError] = React.useState<string | undefined>(undefined);
  const [snack, setSnack] = React.useState<{open:boolean; msg:string}>({ open: false, msg: '' });

  const handleEdit = (c: EmergencyContact) => { setEditing(c); setForm({ name: c.name, phone: c.phone, relation: c.relation || "", priority: c.priority || 0, isFavorite: !!c.isFavorite }); setOpen(true); };
  const handleClose = () => { setOpen(false); setLocalError(undefined); };

  const submit = async () => {
    setBusy(true);
    setLocalError(undefined);
    try {
      if (editing) {
        const r = await updateEmergencyContactAction(editing.id, { ...form });
        if (!r.success) throw new Error(r.error);
        setOpen(false);
        setSnack({ open: true, msg: 'Contato atualizado' });
        window.location.reload();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar contato.";
      setLocalError(msg);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este contato?")) return;
    setBusy(true);
    const r = await deleteEmergencyContactAction(id);
    setBusy(false);
    if (!r.success) setSnack({ open: true, msg: r.error || 'Erro ao remover' });
    else { setSnack({ open: true, msg: 'Contato removido' }); window.location.reload(); }
  };

  const columns: GridColDef<EmergencyContact>[] = [
    { field: "name", headerName: "Nome", flex: 1, minWidth: 160 },
    { field: "phone", headerName: "Telefone", flex: 1, minWidth: 140 },
    { field: "relation", headerName: "Relação", flex: 0.8, minWidth: 120 },
    { field: "priority", headerName: "Prioridade", flex: 0.6, minWidth: 100 },
    { 
      field: "isFavorite", 
      headerName: "Fav.", 
      flex: 0.4, 
      minWidth: 80, 
      renderCell: (params: GridRenderCellParams<EmergencyContact, boolean | undefined>) => (params.row.isFavorite ? "Sim" : "Não"),
    },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      flex: 0.8,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<EmergencyContact, unknown>) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => handleEdit(params.row)} aria-label="Editar"><EditIcon fontSize="small"/></IconButton>
          <IconButton size="small" onClick={() => remove(params.row.id)} aria-label="Excluir" disabled={busy}><DeleteIcon fontSize="small"/></IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Contatos de Emergência
          {citizenId && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Cidadão ID: {citizenId}</Typography>}
        </Typography>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          getRowId={(r)=>r.id} 
          pageSizeOptions={[10,25,50]}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #e0e0e0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8f9fa',
            },
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar Contato de Emergência</DialogTitle>
        <DialogContent>
          {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" value={form.name} onChange={(e)=>setForm(f=>({...f, name: e.target.value}))} fullWidth />
            <TextField label="Telefone" value={form.phone} onChange={(e)=>setForm(f=>({...f, phone: e.target.value}))} fullWidth />
            <TextField label="Relação" value={form.relation} onChange={(e)=>setForm(f=>({...f, relation: e.target.value}))} fullWidth />
            <TextField label="Prioridade" type="number" value={form.priority} onChange={(e)=>setForm(f=>({...f, priority: Number(e.target.value)}))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={submit} variant="contained" disabled={busy}>Salvar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} onClose={()=>setSnack({ open: false, msg: '' })} autoHideDuration={3000} message={snack.msg} />
    </Paper>
  );
}
