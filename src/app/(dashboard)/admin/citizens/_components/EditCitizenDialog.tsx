"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { updateCitizenAction } from "@/lib/actions/admin.actions";

type CitizenProfile = {
  name?: string;
  phone?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
};

type CitizenRow = { 
  id: string; 
  email: string; 
  createdAt?: string; 
  profile?: CitizenProfile 
};

interface EditCitizenDialogProps {
  open: boolean;
  onClose: () => void;
  citizen: CitizenRow | null;
  onSuccess: () => void;
}

export default function EditCitizenDialog({ open, onClose, citizen, onSuccess }: EditCitizenDialogProps) {
  const [form, setForm] = React.useState<CitizenProfile>({});
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (citizen) {
      setForm(citizen.profile || {});
      setError(null);
    }
  }, [citizen]);

  const handleSubmit = async () => {
    if (!citizen) return;
    
    setBusy(true);
    setError(null);
    
    try {
      const result = await updateCitizenAction(citizen.id, form);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Erro ao atualizar cidadão");
      }
    } catch (err) {
      setError("Erro inesperado ao atualizar cidadão");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Editar Cidadão</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Nome"
            value={form.name || ""}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="Telefone"
            value={form.phone || ""}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="Rua"
            value={form.street || ""}
            onChange={(e) => setForm(prev => ({ ...prev, street: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="Número"
            value={form.number || ""}
            onChange={(e) => setForm(prev => ({ ...prev, number: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="Bairro"
            value={form.district || ""}
            onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="Cidade"
            value={form.city || ""}
            onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="Estado"
            value={form.state || ""}
            onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
            fullWidth
          />
          
          <TextField
            label="CEP"
            value={form.zip || ""}
            onChange={(e) => setForm(prev => ({ ...prev, zip: e.target.value }))}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={busy}
        >
          {busy ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
