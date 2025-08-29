"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box } from "@mui/material";
import type { AdminUser } from "@/types/admin.interface";

const columns: GridColDef<AdminUser>[] = [
  { field: "email", headerName: "E-mail", flex: 1, minWidth: 220 },
  { field: "name", headerName: "Nome", flex: 1, minWidth: 160 },
  { field: "roles", headerName: "Perfis", flex: 1, minWidth: 160, valueGetter: (p: any)=>p?.row?.roles.join(", ") },
];

export default function UsersTable({ rows, error }: { rows: AdminUser[]; error?: string }) {
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DataGrid rows={rows} columns={columns} getRowId={(r)=>r.id} pageSizeOptions={[10,25,50]} />
    </Box>
  );
}
