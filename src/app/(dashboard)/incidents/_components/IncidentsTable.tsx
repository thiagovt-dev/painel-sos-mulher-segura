"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box } from "@mui/material";
import type { Incident } from "@/types/incidents.interface";

const columns: GridColDef[] = [
  { field: "code", headerName: "Código", flex: 1, minWidth: 120 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  { field: "address", headerName: "Endereço", flex: 2, minWidth: 200 },
  { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
];

export default function IncidentsTable({ rows, error }: { rows: Incident[]; error?: string }) {
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
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
      />
    </Box>
  );
}
