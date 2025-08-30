"use client";

import { DataGrid, GridColDef, GridToolbar, GridRenderCellParams } from "@mui/x-data-grid";
import { 
  Alert, 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";
import type { AdminUser } from "@/types/admin.interface";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { createAdminUserAction } from "@/lib/actions/admin.actions";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

const columns: GridColDef<AdminUser>[] = [
  { 
    field: "email", 
    headerName: "E-mail", 
    flex: 1.5, 
    minWidth: 250,
    renderCell: (params: GridRenderCellParams<AdminUser, string | undefined>) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'primary.main',
            fontSize: '0.875rem'
          }}
        >
          {(params.value?.charAt(0).toUpperCase()) ?? '?'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {params.value ?? ''}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {params.row.id}
          </Typography>
        </Box>
      </Box>
    )
  },
  { 
    field: "name", 
    headerName: "Nome", 
    flex: 1, 
    minWidth: 180,
    renderCell: (params: GridRenderCellParams<AdminUser, string | undefined>) => (
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500,
          color: params.value ? 'text.primary' : 'text.secondary',
          fontStyle: params.value ? 'normal' : 'italic'
        }}
      >
        {params.value || 'Não informado'}
      </Typography>
    )
  },
  {
    field: "roles",
    headerName: "Perfis",
    flex: 1.2,
    minWidth: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams<AdminUser, ("ADMIN"|"POLICE"|"CITIZEN")[]>) => (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {params.row.roles.map((role: string) => (
          <Chip
            key={role}
            label={role}
            size="small"
            color={role === 'ADMIN' ? 'primary' : 'default'}
            icon={role === 'ADMIN' ? <AdminPanelSettingsIcon /> : undefined}
            sx={{
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
              }
            }}
          />
        ))}
      </Box>
    ),
  },
  {
    field: "actions",
    headerName: "Ações",
    sortable: false,
    flex: 0.8,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<AdminUser, unknown>) => {
      void params; // avoid unused param lint warning
      return (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar usuário">
            <IconButton 
              size="small" 
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir usuário">
            <IconButton 
              size="small" 
              color="error"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      );
    },
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
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper' }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Usuários Administrativos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie os usuários com acesso administrativo ao sistema
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => router.refresh()}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Atualizar
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={()=>setOpen(true)}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Adicionar Usuário
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
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            backgroundColor: 'background.paper',
            '& .MuiDataGrid-cell': {
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              padding: '12px 16px',
              backgroundColor: 'background.paper',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
              borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
              '& .MuiDataGrid-columnHeader': {
                padding: '16px',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.primary',
              }
            },
            '& .MuiDataGrid-row': {
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#3a3a3a' : '#f5f7fa',
              },
              '&:nth-of-type(even)': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#fafbfc',
              }
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: '16px',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: 'background.paper',
            }
          }}
        />
      </Box>

      <Dialog open={open} onClose={()=>safeSetOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Novo Usuário Administrativo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adicione um novo usuário com acesso administrativo
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField 
              label="E-mail" 
              value={form.email} 
              onChange={(e)=>setForm(f=>({...f, email: e.target.value}))} 
              fullWidth 
              variant="outlined"
              size="medium"
            />
            <TextField 
              label="Nome de usuário" 
              value={form.username} 
              onChange={(e)=>setForm(f=>({...f, username: e.target.value}))} 
              fullWidth 
              variant="outlined"
              size="medium"
            />
            <TextField 
              label="Senha" 
              type="password" 
              value={form.password} 
              onChange={(e)=>setForm(f=>({...f, password: e.target.value}))} 
              fullWidth 
              variant="outlined"
              size="medium"
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={()=>safeSetOpen(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={async ()=>{
              safeSetBusy(true);
              const r = await createAdminUserAction({ email: form.email, username: form.username, password: form.password });
              safeSetBusy(false);
              if (!r.success) alert(r.error);
              else { safeSetOpen(false); router.refresh(); }
            }} 
            variant="contained" 
            disabled={busy || !form.email || !form.username || !form.password}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            {busy ? "Criando..." : "Criar Usuário"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
