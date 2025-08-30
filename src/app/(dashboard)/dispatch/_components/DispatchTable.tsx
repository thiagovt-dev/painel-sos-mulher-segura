"use client";
import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Alert, Box, Chip, Stack, Button, Snackbar } from "@mui/material";
import { tDispatchStatus } from "@/lib/i18n/strings";
import type { Dispatch } from "@/types/dispatch.interface";
import { resolveDispatchAction, cancelDispatchAction } from "@/lib/actions/dispatch.actions";

const baseColumns: GridColDef<Dispatch>[] = [
  { field: "id", headerName: "ID", flex: 1, minWidth: 200 },
  { field: "incidentId", headerName: "Incidente", flex: 1, minWidth: 200 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 120, renderCell: (p)=> <Chip size="small" label={tDispatchStatus(String(p.value))} /> },
  { field: "createdAt", headerName: "Criado em", flex: 1, minWidth: 160 },
  {
    field: "actions",
    headerName: "Ações",
    sortable: false,
    flex: 1,
    minWidth: 220,
    renderCell: (p) => (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={async ()=>{
          const reason = prompt("Motivo da conclusão (resolve)", "Atendido com sucesso");
          if (reason) {
            const r = await resolveDispatchAction(p.row.id, { reason });
            if (!r.success) alert(r.error); else window.location.reload();
          }
        }}>Concluir</Button>
        <Button size="small" color="warning" onClick={async ()=>{
          const reason = prompt("Motivo do cancelamento", "Ocorrência cancelada");
          if (reason) {
            const r = await cancelDispatchAction(p.row.id, { reason });
            if (!r.success) alert(r.error); else window.location.reload();
          }
        }}>Cancelar</Button>
      </Stack>
    )
  }
];

export default function DispatchTable({ rows, error }: { rows: Dispatch[]; error?: string }) {
  const [snack, setSnack] = React.useState<{open: boolean; msg: string}>({ open: false, msg: '' });
  const mounted = React.useRef(false);
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const openSnack = React.useCallback((msg: string) => { if (mounted.current) setSnack({ open: true, msg }); }, []);
  const columns = React.useMemo(() => baseColumns.map(c => c.field === 'actions' ? ({...c, renderCell: (p: GridRenderCellParams<Dispatch>)=> (
    <Stack direction="row" spacing={1}>
      <Button size="small" variant="outlined" onClick={async ()=>{
        const reason = prompt("Motivo da conclusão (resolve)", "Atendido com sucesso");
        if (reason) {
          const r = await resolveDispatchAction(p.row.id, { reason });
          if (!r.success) openSnack(r.error || 'Erro ao concluir'); 
          else { openSnack('Dispatch concluído'); window.location.reload(); }
        }
      }}>Concluir</Button>
      <Button size="small" color="warning" onClick={async ()=>{
        const reason = prompt("Motivo do cancelamento", "Ocorrência cancelada");
        if (reason) {
          const r = await cancelDispatchAction(p.row.id, { reason });
          if (!r.success) openSnack(r.error || 'Erro ao cancelar'); 
          else { openSnack('Dispatch cancelado'); window.location.reload(); }
        }
      }}>Cancelar</Button>
    </Stack>
  )}): c), [openSnack]);
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <DataGrid rows={rows} columns={columns} getRowId={(r)=>r.id} pageSizeOptions={[10,25,50]} />
      <Snackbar open={snack.open} onClose={()=>setSnack({open:false, msg:''})} autoHideDuration={3000} message={snack.msg} />
    </Box>
  );
}
