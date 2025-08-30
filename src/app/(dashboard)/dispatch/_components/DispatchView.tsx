"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { Box, Stack, TextField, MenuItem, Paper, Typography, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import type { Unit } from "@/types/units.interface";
import type { Dispatch } from "@/types/dispatch.interface";
const DispatchTable = dynamic(() => import("./DispatchTable"), { ssr: false });
import { listDispatchByUnitAction } from "@/lib/actions/dispatch.actions";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";

export default function DispatchView({ units }: { units: Unit[] }) {
  const [unitId, setUnitId] = React.useState(units[0]?.id || "");
  const [dispatchStatus, setDispatchStatus] = React.useState<string>("ALL");
  const [incidentStatus, setIncidentStatus] = React.useState<string>("ALL");
  const [from, setFrom] = React.useState<string>("");
  const [to, setTo] = React.useState<string>("");
  const [period, setPeriod] = React.useState<7 | 30 | 90 | 'custom'>(30);
  const [rows, setRows] = React.useState<Dispatch[]>([]);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!unitId) return;
    (async () => {
      setLoading(true); setError(undefined);
      const res = await listDispatchByUnitAction({ unitId, dispatchStatus: dispatchStatus !== 'ALL' ? dispatchStatus : undefined, incidentStatus: incidentStatus !== 'ALL' ? incidentStatus : undefined });
      setLoading(false);
      if (!res.success) { setError(res.error); setRows([]); }
      else setRows(res.data!);
    })();
  }, [unitId, dispatchStatus, incidentStatus]);

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

  const filtered = React.useMemo(() => {
    return rows.filter(r => {
      const created = new Date(r.createdAt).getTime();
      const okFrom = from ? created >= new Date(from).setHours(0,0,0,0) : true;
      const okTo = to ? created < new Date(to).setHours(24,0,0,0) : true;
      return okFrom && okTo;
    });
  }, [rows, from, to]);

  // Redireciona se erro de sessão
  useAuthRedirect(error);
  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField select label="Viatura" value={unitId} onChange={(e)=>setUnitId(e.target.value)} sx={{ minWidth: 220 }}>
            {units.map(u => <MenuItem key={u.id} value={u.id}>{u.name} — {u.plate || u.username}</MenuItem>)}
          </TextField>
          <TextField select label="Status Dispatch" value={dispatchStatus} onChange={(e)=>setDispatchStatus(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="PENDING">Pendente</MenuItem>
            <MenuItem value="NOTIFIED">Notificado</MenuItem>
            <MenuItem value="ACCEPTED">Aceito</MenuItem>
            <MenuItem value="REJECTED">Recusado</MenuItem>
            <MenuItem value="CANCELED">Cancelado</MenuItem>
          </TextField>
          <TextField select label="Status Incidente" value={incidentStatus} onChange={(e)=>setIncidentStatus(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="OPEN">Aberto</MenuItem>
            <MenuItem value="IN_DISPATCH">Em Despacho</MenuItem>
            <MenuItem value="RESOLVED">Resolvido</MenuItem>
            <MenuItem value="CANCELED">Cancelado</MenuItem>
          </TextField>
          <ToggleButtonGroup exclusive size="small" value={period} onChange={(_, v)=> setPeriod(v || 'custom')}>
            <ToggleButton value={7}>7d</ToggleButton>
            <ToggleButton value={30}>30d</ToggleButton>
            <ToggleButton value={90}>90d</ToggleButton>
            <ToggleButton value={'custom'}>Custom</ToggleButton>
          </ToggleButtonGroup>
          <TextField label="De" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Até" type="date" value={to} onChange={(e)=>setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          <Button onClick={()=>{
            // reexecuta busca (útil se trocar apenas datas locais)
            setRows([...rows]);
          }}>Aplicar</Button>
        </Stack>
      </Paper>
      <DispatchTable rows={filtered} error={error} />
    </Box>
  );
}
