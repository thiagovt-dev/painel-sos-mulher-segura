"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { listCitizenEmergencyContactsAction } from "@/lib/actions/emergency-contacts.actions";
import type { EmergencyContact } from "@/types/emergency-contacts.interface";

interface EmergencyContactsDialogProps {
  open: boolean;
  onClose: () => void;
  citizenId: string;
  citizenName?: string;
}

export default function EmergencyContactsDialog({
  open,
  onClose,
  citizenId,
  citizenName,
}: EmergencyContactsDialogProps) {
  const [contacts, setContacts] = React.useState<EmergencyContact[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const loadContacts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCitizenEmergencyContactsAction(citizenId);
      if (result.success) {
        setContacts(result.data || []);
      } else {
        setError(result.error || "Erro ao carregar contatos");
      }
    } catch {
      setError("Erro inesperado ao carregar contatos");
    } finally {
      setLoading(false);
    }
  }, [citizenId]);

  React.useEffect(() => {
    if (open && citizenId) {
      loadContacts();
    }
  }, [open, citizenId, loadContacts]);

  const columns: GridColDef<EmergencyContact>[] = [
    { field: "name", headerName: "Nome", flex: 1, minWidth: 160 },
    { field: "phone", headerName: "Telefone", flex: 1, minWidth: 140 },
    { field: "relation", headerName: "Relação", flex: 0.8, minWidth: 120 },
    { field: "priority", headerName: "Prioridade", flex: 0.6, minWidth: 100 },
    {
      field: "isFavorite",
      headerName: "Fav.",
      flex: 0.4,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams<EmergencyContact, boolean | undefined>) => (
        params.row.isFavorite ? "Sim" : "Não"
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Contatos de Emergência
        {citizenName && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {citizenName}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={contacts}
              columns={columns}
              getRowId={(r) => r.id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              sx={{
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #e0e0e0",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  borderBottom: "2px solid #e0e0e0",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
