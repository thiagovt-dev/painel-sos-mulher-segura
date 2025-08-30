"use client";
import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Alert, FormControl, InputLabel, Select, MenuItem, LinearProgress, Typography } from "@mui/material";
import { listUnitsAction } from "@/lib/actions/units.actions";
import { createDispatchAction, listDispatchByUnitAction } from "@/lib/actions/dispatch.actions";
import type { Unit } from "@/types/units.interface";

type Props = { open: boolean; incidentId: string; onClose: () => void };

export default function DispatchDialog({ open, incidentId, onClose }: Props) {
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [unitId, setUnitId] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [status, setStatus] = React.useState<string | null>(null);
  const [dispatchId, setDispatchId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await listUnitsAction();
      if (mounted) setUnits(r.success ? r.data! : []);
    })();
    return () => { mounted = false; };
  }, [open]);

  React.useEffect(() => {
    if (!dispatchId || !unitId) return;
    setStatus("Aguardando aceite da viatura...");
    const id = setInterval(async () => {
      const r = await listDispatchByUnitAction({ unitId });
      if (!r.success) return;
      const found = r.data!.find(d => d.id === dispatchId);
      if (found && found.status === "ACCEPTED") {
        setStatus("Viatura ACEITOU o incidente.");
        clearInterval(id);
      }
    }, 3000);
    return () => clearInterval(id);
  }, [dispatchId, unitId]);

  const submit = async () => {
    setSubmitting(true);
    setError(undefined);
    setStatus(null);
    try {
      const r = await createDispatchAction({ incidentId, unitId });
      if (!r.success) throw new Error(r.error);
      setDispatchId(r.data!.id);
      setStatus("Despacho criado. Notificando viatura...");
    } catch (e: any) {
      setError(e?.message || "Erro ao despachar incidente.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setUnits([]); setUnitId(""); setDispatchId(null); setStatus(null); setError(undefined); onClose();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>Despachar incidente</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="unit-label">Viatura</InputLabel>
            <Select labelId="unit-label" label="Viatura" value={unitId} onChange={(e)=>setUnitId(e.target.value as string)}>
              {units.map(u => (
                <MenuItem value={u.id} key={u.id}>{u.name} — {u.plate || u.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {status && (
            <Stack spacing={1}>
              <Typography variant="body2">{status}</Typography>
              <LinearProgress />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Fechar</Button>
        <Button onClick={submit} variant="contained" disabled={!unitId || submitting}>Despachar</Button>
      </DialogActions>
    </Dialog>
  );
}

