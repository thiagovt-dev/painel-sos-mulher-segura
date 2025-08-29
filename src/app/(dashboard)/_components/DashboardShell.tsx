"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import * as React from "react";
import LogoutButton from "./LogoutButton";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" color="primary" enableColorOnDark>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            SOS Mulher Segura - Admin
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggle}>
        <Box sx={{ width: 260 }} role="presentation" onClick={toggle}>
          <List>
            {[
              { label: "Visão geral", href: "/" },
              { label: "Incidentes", href: "/incidents" },
              { label: "Dispatch", href: "/dispatch" },
              { label: "Viaturas", href: "/units" },
              { label: "Cidadãos", href: "/admin/citizens" },
              { label: "Admin Users", href: "/admin/users" },
              { label: "Contatos de Emergência", href: "/emergency-contacts" },
              { label: "Gravações de Voz", href: "/voice/recordings" },
            ].map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton LinkComponent={Link} href={`/${item.href.replace(/^\//, "")}`}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
