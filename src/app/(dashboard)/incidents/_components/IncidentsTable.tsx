"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Stack } from "@mui/material";
import type { Incident, CloseIncidentDTO, CancelIncidentDTO } from "@/types/incidents.interface";

type Props = {
  rows: Incident[];
  error?: string;
  onClose: (id: string, dto: CloseIncidentDTO) => Promise<{ success: boolean; error?: string }>;
  onCancel: (id: string, dto: CancelIncidentDTO) => Promise<{ success: boolean; error?: string }>;
};

export default function IncidentsTable({ rows, error, onClose, onCancel }: Props) {
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const columns: GridColDef[] = [
    { field: "code", headerName: "Código", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
    { field: "address", headerName: "Endereço", flex: 2, minWidth: 220 },
    { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      flex: 1,
      minWidth: 220,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={async () => { setBusyId(p.row.id); await onClose(p.row.id, { as: "RESOLVED", reason: "Resolvido pelo painel" }); setBusyId(null); }} disabled={busyId===p.row.id}>Encerrar</Button>
          <Button size="small" color="warning" onClick={async () => { setBusyId(p.row.id); await onCancel(p.row.id, { reason: "Cancelado pelo painel" }); setBusyId(null); }} disabled={busyId===p.row.id}>Cancelar</Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id} pageSizeOptions={[10, 25, 50]} />
    </Box>
  );
}
