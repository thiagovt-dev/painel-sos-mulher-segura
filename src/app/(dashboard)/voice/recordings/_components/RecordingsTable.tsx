"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button } from "@mui/material";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import type { VoiceRecording } from "@/types/voice-recordings.interface";

const columns: GridColDef<VoiceRecording>[] = [
  { field: "filename", headerName: "Arquivo", flex: 1, minWidth: 200 },
  { field: "durationSec", headerName: "Duração (s)", flex: 0.6, minWidth: 120 },
  { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
  {
    field: "download",
    headerName: "Download",
    sortable: false,
    flex: 0.6, minWidth: 120,
    renderCell: (p) => <Button href={p.row.signedUrl} target="_blank">Baixar</Button>,
  },
];

export default function RecordingsTable({ rows, error }: { rows: VoiceRecording[]; error?: string }) {
  useAuthRedirect(error);
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DataGrid rows={rows} columns={columns} getRowId={(r)=>r.id} pageSizeOptions={[10,25,50]} />
    </Box>
  );
}
