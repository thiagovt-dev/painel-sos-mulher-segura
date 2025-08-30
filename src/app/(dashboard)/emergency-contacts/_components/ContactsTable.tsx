"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography, IconButton, Snackbar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createEmergencyContactAction, deleteEmergencyContactAction, updateEmergencyContactAction } from "@/lib/actions/emergency-contacts.actions";
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

  const handleAdd = () => { setEditing(null); setForm({ name: "", phone: "", relation: "", priority: 0, isFavorite: false }); setOpen(true); };
  const handleEdit = (c: EmergencyContact) => { setEditing(c); setForm({ name: c.name, phone: c.phone, relation: c.relation || "", priority: c.priority || 0, isFavorite: !!c.isFavorite }); setOpen(true); };
  const handleClose = () => { setOpen(false); setLocalError(undefined); };

  const submit = async () => {
    setBusy(true);
    setLocalError(undefined);
    try {
      if (editing) {
        const r = await updateEmergencyContactAction(editing.id, { ...form });
        if (!r.success) throw new Error(r.error);
      } else {
        const r = await createEmergencyContactAction({ ...form });
        if (!r.success) throw new Error(r.error);
      }
      setOpen(false);
      setSnack({ open: true, msg: editing ? 'Contato atualizado' : 'Contato criado' });
      window.location.reload();
    } catch (e: any) {
      setLocalError(e?.message || "Erro ao salvar contato.");
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
    { field: "isFavorite", headerName: "Fav.", flex: 0.4, minWidth: 80, valueGetter: (p)=> p.row.isFavorite ? "Sim" : "Não" },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      flex: 0.8,
      minWidth: 140,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => handleEdit(p.row)} aria-label="Editar"><EditIcon fontSize="small"/></IconButton>
          <IconButton size="small" onClick={() => remove(p.row.id)} aria-label="Excluir" disabled={busy}><DeleteIcon fontSize="small"/></IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>Contatos de Emergência</Typography>
        <Stack direction="row" spacing={2}>
          {citizenId && (
            <Alert severity="info">Visualizando contatos do usuário logado. Para ver de um cidadão específico, é necessário endpoint admin.</Alert>
          )}
          <Button variant="contained" startIcon={<AddIcon/>} onClick={handleAdd}>Adicionar</Button>
        </Stack>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} getRowId={(r)=>r.id} pageSizeOptions={[10,25,50]} />
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar Contato" : "Novo Contato"}</DialogTitle>
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
          <Button onClick={submit} variant="contained" disabled={busy}>{editing ? "Salvar" : "Criar"}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} onClose={()=>setSnack({ open: false, msg: '' })} autoHideDuration={3000} message={snack.msg} />
    </Box>
  );
}
