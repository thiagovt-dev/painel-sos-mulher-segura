"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, IconButton, Tooltip, Snackbar } from "@mui/material";
import type { Unit } from "@/types/units.interface";
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import { createUnitAction, resetUnitPinAction, updateUnitAction } from "@/lib/actions/units.actions";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

const baseColumns: GridColDef<Unit>[] = [
  { field: "name", headerName: "Viatura", flex: 1, minWidth: 150 },
  { field: "username", headerName: "Usuário", flex: 1, minWidth: 120 },
  { field: "plate", headerName: "Placa", flex: 1, minWidth: 110 },
  {
    field: "active",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: (p) => (
      <Chip
        label={p.value ? "Ativa" : "Inativa"}
        color={p.value ? "success" : "default"}
        size="small"
      />
    ),
  },
];

export default function UnitsTable({ rows, error }: { rows: Unit[]; error?: string }) {
  useAuthRedirect(error);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState<null | Unit>(null);
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", plate: "", username: "", pin: "" });
  const [snack, setSnack] = React.useState<{open:boolean; msg:string}>({ open: false, msg: '' });

  const columns: GridColDef<Unit>[] = [
    ...baseColumns,
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      flex: 0.8,
      minWidth: 160,
      renderCell: (p) => (
        <Tooltip title="Redefinir PIN (gera novo PIN)">
          <span>
            <IconButton size="small" onClick={async ()=>{
              const r = await resetUnitPinAction(p.row.id);
              if (!r.success) setSnack({ open: true, msg: r.error || 'Erro ao redefinir PIN' });
              else setSnack({ open: true, msg: `PIN redefinido: ${r.data!.pin}` });
            }}>
              <KeyIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )
    },
    {
      field: 'edit', headerName: 'Editar', sortable:false, flex:0.6, minWidth:120, renderCell: (p)=> (
        <Button size="small" onClick={()=>setEditOpen(p.row)}>Editar</Button>
      )
    }
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box />
        <Button variant="contained" startIcon={<AddIcon/>} onClick={()=>setOpen(true)}>Adicionar Unidade</Button>
      </Stack>
      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}
      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid 
          rows={rows} 
          columns={columns}
          getRowId={(r) => r.id} 
          pageSizeOptions={[10, 25, 50]} 
        />
      </Box>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nova Unidade</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" value={form.name} onChange={(e)=>setForm(f=>({...f, name: e.target.value}))} fullWidth />
            <TextField label="Placa" value={form.plate} onChange={(e)=>setForm(f=>({...f, plate: e.target.value}))} fullWidth />
            <TextField label="Usuário (username)" value={form.username} onChange={(e)=>setForm(f=>({...f, username: e.target.value}))} fullWidth />
            <TextField label="PIN" value={form.pin} onChange={(e)=>setForm(f=>({...f, pin: e.target.value}))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button onClick={async ()=>{
            setBusy(true);
            const r = await createUnitAction({ name: form.name, plate: form.plate || undefined, username: form.username, pin: form.pin });
            setBusy(false);
            if (!r.success) setSnack({ open: true, msg: r.error || 'Erro ao criar unidade' });
            else { setOpen(false); setSnack({ open: true, msg: 'Unidade criada' }); router.refresh(); }
          }} disabled={busy || !form.name || !form.username || !form.pin} variant="contained">Criar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} onClose={()=>setSnack({ open: false, msg: '' })} autoHideDuration={3000} message={snack.msg} />
    
    {/* Edit Dialog */}
    <Dialog open={!!editOpen} onClose={()=>setEditOpen(null)} fullWidth maxWidth="sm">
      <DialogTitle>Editar Unidade</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" value={editOpen?.name || ''} onChange={(e)=>setEditOpen(u=>u?{...u, name: e.target.value}:u)} fullWidth />
          <TextField label="Placa" value={editOpen?.plate || ''} onChange={(e)=>setEditOpen(u=>u?{...u, plate: e.target.value}:u)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setEditOpen(null)}>Cancelar</Button>
        <Button onClick={async ()=>{
          if (!editOpen) return; setBusy(true);
          const r = await updateUnitAction(editOpen.id, { name: editOpen.name, plate: editOpen.plate, active: editOpen.active });
          setBusy(false);
          if (!r.success) setSnack({ open: true, msg: r.error || 'Erro ao salvar' }); else { setEditOpen(null); setSnack({ open: true, msg: 'Unidade atualizada' }); router.refresh(); }
        }} disabled={busy} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
}
