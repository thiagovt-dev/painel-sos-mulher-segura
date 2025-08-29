"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Chip } from "@mui/material";
import type { Dispatch } from "@/types/dispatch.interface";

const columns: GridColDef<Dispatch>[] = [
  { field: "id", headerName: "ID", flex: 1, minWidth: 200 },
  { field: "incidentId", headerName: "Incidente", flex: 1, minWidth: 200 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 120, renderCell: (p)=> <Chip size="small" label={p.value} /> },
  { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
];

export default function DispatchTable({ rows, error }: { rows: Dispatch[]; error?: string }) {
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DataGrid rows={rows} columns={columns} getRowId={(r)=>r.id} pageSizeOptions={[10,25,50]} />
    </Box>
  );
}
