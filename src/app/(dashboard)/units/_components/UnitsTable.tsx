"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Chip } from "@mui/material";
import type { Unit } from "@/types/units.interface";

const columns: GridColDef<Unit>[] = [
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
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
}
