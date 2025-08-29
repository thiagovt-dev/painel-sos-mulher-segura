"use client";

import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Alert, Box, Paper, Typography, Button, Stack } from "@mui/material";
import type { AdminUser } from "@/types/admin.interface";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

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
    valueGetter: (p: any) => p?.row?.roles.join(", "),
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {params.value?.split(", ").map((role: string, index: number) => (
          <Box
            key={index}
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
    )
  },
];

export default function UsersTable({ rows, error }: { rows: AdminUser[]; error?: string }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Usuários Administrativos
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Implementar adição de usuário */}}
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
          columns={columns} 
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
    </Paper>
  );
}
