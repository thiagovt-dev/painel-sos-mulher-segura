"use client";

import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Alert, Box, Paper, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import type { AdminUser } from "@/types/admin.interface";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createAdminUserAction } from "@/lib/actions/admin.actions";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

const columns: GridColDef<AdminUser>[] = [
  { 
    field: "email", 
    headerName: "E-mail", 
    flex: 1, 
    minWidth: 220,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {params.value}
      </Typography>
    )
  },
  { 
    field: "name", 
    headerName: "Nome", 
    flex: 1, 
    minWidth: 160,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.value}
      </Typography>
    )
  },
  {
    field: "roles",
    headerName: "Perfis",
    flex: 1,
    minWidth: 160,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {params.row.roles.map((role) => (
          <Box
            key={role}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {role}
          </Box>
        ))}
      </Box>
    ),
  },
];

export default function UsersTable({ rows, error }: { rows: AdminUser[]; error?: string }) {
  useAuthRedirect(error);
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", username: "", password: "" });
  const router = useRouter();
  const mounted = React.useRef(false);
  React.useEffect(()=>{ mounted.current = true; return ()=>{ mounted.current = false; }; }, []);
  const safeSetOpen = React.useCallback((v:boolean)=>{ if(mounted.current) setOpen(v); },[]);
  const safeSetBusy = React.useCallback((v:boolean)=>{ if(mounted.current) setBusy(v); },[]);
  const memoColumns = React.useMemo(() => columns, []);
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Usuários Administrativos do Sistema
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => router.refresh()}
            >
              Atualizar
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setOpen(true)}>
              Adicionar Usuário (Admin)
            </Button>
          </Stack>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid 
          rows={rows} 
          columns={memoColumns} 
          getRowId={(r) => r.id} 
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
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

      <Dialog open={open} onClose={()=>safeSetOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Usuário Admin</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="E-mail" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))} fullWidth />
            <TextField label="Username" value={form.username} onChange={(e)=>setForm(f=>({...f, username: e.target.value}))} fullWidth />
            <TextField label="Senha" type="password" value={form.password} onChange={(e)=>setForm(f=>({...f, password: e.target.value}))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>safeSetOpen(false)}>Cancelar</Button>
          <Button onClick={async ()=>{
            safeSetBusy(true);
            const r = await createAdminUserAction({ email: form.email, username: form.username, password: form.password });
            safeSetBusy(false);
            if (!r.success) alert(r.error);
            else { safeSetOpen(false); router.refresh(); }
          }} variant="contained" disabled={busy || !form.email || !form.username || !form.password}>Criar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
