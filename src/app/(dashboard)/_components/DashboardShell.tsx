"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportIcon from "@mui/icons-material/Report";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import MicIcon from "@mui/icons-material/Mic";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationsProvider, useNotifications } from "@/lib/contexts/NotificationsContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import * as React from "react";
import LogoutButton from "./LogoutButton";
import Breadcrumb from "./Breadcrumb";
import ThemeToggle from "./ThemeToggle";

const drawerWidth = 240;

const menuItems = [
  { label: "Visão Geral", href: "/", icon: <DashboardIcon /> },
  { label: "Incidentes", href: "/incidents", icon: <ReportIcon /> },
  { label: "Dispatch", href: "/dispatch", icon: <LocalShippingIcon /> },
  { label: "Viaturas", href: "/units", icon: <DirectionsCarIcon /> },
  { label: "Cidadãos", href: "/admin/citizens", icon: <PeopleIcon /> },
  { label: "Admin Users", href: "/admin/users", icon: <AdminPanelSettingsIcon /> },
  { label: "Contatos de Emergência", href: "/emergency-contacts", icon: <ContactPhoneIcon /> },
  { label: "Gravações de Voz", href: "/voice/recordings", icon: <MicIcon /> },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = React.useState<null | HTMLElement>(null);
  const { unread, items, markAllRead } = useNotifications();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // Importar e executar o logout diretamente
      const { logoutAction } = await import("@/lib/actions/auth.actions");
      await logoutAction();
      handleProfileMenuClose();
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          SOS Mulher Segura
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton LinkComponent={Link} href={item.href}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Painel Administrativo
          </Typography>
          
          {/* Notifications */}
          <IconButton color="inherit" sx={{ ml: 1 }} onClick={(e)=> setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={unread} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Menu */}
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2">Perfil</Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2">Configurações</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                Sair
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Breadcrumb />
        {children}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={()=> setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2">Notificações</Typography>
          </MenuItem>
          {items.length === 0 && <MenuItem disabled><Typography variant="body2">Sem novas notificações</Typography></MenuItem>}
          {items.slice(0,20).map(n => (
            <MenuItem key={n.id}>
              <Typography variant="body2">{n.title}</Typography>
            </MenuItem>
          ))}
          {items.length > 0 && (
            <MenuItem onClick={()=> { markAllRead(); setNotifAnchor(null); }}>
              <Typography variant="body2">Marcar todas como lidas</Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsProvider>
      <ShellInner>{children}</ShellInner>
    </NotificationsProvider>
  );
}
