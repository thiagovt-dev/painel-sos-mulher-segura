"use client";
import * as React from "react";
import { Snackbar, Alert } from "@mui/material";

type Severity = "success" | "info" | "warning" | "error";

type ToastContextType = {
  show: (message: string, severity?: Severity) => void;
};

const ToastCtx = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("ToastProvider ausente");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState<Severity>("info");

  const show = React.useCallback((msg: string, sev: Severity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastCtx.Provider>
  );
}

