"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box } from "@mui/material";

const columns: GridColDef[] = [
  { field: "email", headerName: "E-mail", flex: 1, minWidth: 220 },
  { field: "phone", headerName: "Telefone", flex: 1, minWidth: 140 },
  { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
];

export default function CitizensTable({ rows, error }: { rows: any[]; error?: string }) {
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DataGrid rows={rows} columns={columns} getRowId={(r)=>r.id} pageSizeOptions={[10,25,50]} />
    </Box>
  );
}
