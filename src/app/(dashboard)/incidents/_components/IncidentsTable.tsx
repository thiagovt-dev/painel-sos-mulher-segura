"use client";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Button, Stack, TextField, MenuItem, Paper, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import TrendsChart from "../../_components/TrendsChart";
import DispatchDialog from "../../dispatch/_components/DispatchDialog";
import { tIncidentStatus } from "@/lib/i18n/strings";
import type { Incident, CloseIncidentDTO, CancelIncidentDTO } from "@/types/incidents.interface";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

type Props = {
  rows: Incident[];
  error?: string;
  onClose: (id: string, dto: CloseIncidentDTO) => Promise<{ success: boolean; error?: string }>;
  onCancel: (id: string, dto: CancelIncidentDTO) => Promise<{ success: boolean; error?: string }>;
};

export default function IncidentsTable({ rows, error, onClose, onCancel }: Props) {
  useAuthRedirect(error);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [dispatchIncidentId, setDispatchIncidentId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string>("ALL");
  const [from, setFrom] = React.useState<string>("");
  const [to, setTo] = React.useState<string>("");
  const [period, setPeriod] = React.useState<7|30|90|'custom'>(30);

  const filtered = React.useMemo(()=>{
    return rows.filter(r => {
      const okStatus = status === 'ALL' ? true : r.status === status;
      const created = new Date(r.createdAt).getTime();
      const okFrom = from ? created >= new Date(from).setHours(0,0,0,0) : true;
      const okTo = to ? created < new Date(to).setHours(24,0,0,0) : true;
      return okStatus && okFrom && okTo;
    });
  }, [rows, status, from, to]);

  const trendData = React.useMemo(()=>{
    const days: { date: string; count: number }[] = [];
    const d = new Date();
    for (let i=13; i>=0; i--) {
      const ref = new Date(d);
      ref.setDate(d.getDate() - i);
      ref.setHours(0,0,0,0);
      const next = new Date(ref); next.setDate(ref.getDate()+1);
      const count = filtered.filter(x => {
        const c = new Date(x.createdAt);
        return c >= ref && c < next;
      }).length;
      days.push({ date: ref.toISOString().slice(0,10), count });
    }
    return days;
  }, [filtered]);

  React.useEffect(() => {
    if (period === 'custom') return;
    const d = new Date();
    const start = new Date(d);
    start.setDate(d.getDate() - (period - 1));
    start.setHours(0,0,0,0);
    const end = new Date(d);
    end.setHours(23,59,59,999);
    setFrom(start.toISOString().slice(0,10));
    setTo(end.toISOString().slice(0,10));
  }, [period]);
  const columns: GridColDef[] = [
    { field: "code", headerName: "Código", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120, valueFormatter: (p)=> tIncidentStatus(String(p.value)) },
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
          <Button size="small" color="info" onClick={() => setDispatchIncidentId(p.row.id)}>Despachar</Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField select label="Status" value={status} onChange={(e)=>setStatus(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="ALL">Todos</MenuItem>
          <MenuItem value="OPEN">Abertos</MenuItem>
          <MenuItem value="IN_DISPATCH">Em Despacho</MenuItem>
          <MenuItem value="RESOLVED">Encerrados</MenuItem>
          <MenuItem value="CANCELED">Cancelados</MenuItem>
        </TextField>
        <ToggleButtonGroup exclusive size="small" value={period} onChange={(_, v)=> setPeriod(v || 'custom')}>
          <ToggleButton value={7}>7d</ToggleButton>
          <ToggleButton value={30}>30d</ToggleButton>
          <ToggleButton value={90}>90d</ToggleButton>
          <ToggleButton value={'custom'}>Custom</ToggleButton>
        </ToggleButtonGroup>
        <TextField label="De" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Até" type="date" value={to} onChange={(e)=>setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
      </Stack>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Tendência (14 dias) — aplica filtros</Typography>
        <TrendsChart data={trendData} />
      </Paper>
      <Box sx={{ height: 560, width: '100%' }}>
        <DataGrid rows={filtered} columns={columns} getRowId={(r) => r.id} pageSizeOptions={[10, 25, 50]} />
      </Box>
      <DispatchDialog open={!!dispatchIncidentId} incidentId={dispatchIncidentId || ''} onClose={() => setDispatchIncidentId(null)} />
    </Box>
  );
}
