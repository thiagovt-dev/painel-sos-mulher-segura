import { 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Box,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  LinearProgress,
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import React from "react";

export default async function DashboardHome() {
  const stats = [
    { 
      label: "Incidentes Abertos", 
      value: "12", 
      icon: <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main',
      progress: 60,
      change: "+12%",
      changeColor: 'success.main'
    },
    { 
      label: "Em Despacho", 
      value: "8", 
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.main',
      progress: 40,
      change: "+8%",
      changeColor: 'success.main'
    },
    { 
      label: "Encerrados Hoje", 
      value: "24", 
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
      progress: 80,
      change: "+25%",
      changeColor: 'success.main'
    },
    { 
      label: "Viaturas Ativas", 
      value: "15", 
      icon: <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
      progress: 75,
      change: "+5%",
      changeColor: 'success.main'
    },
  ];

  const recentActivities = [
    { time: "2 min atrás", text: "Novo incidente reportado na região central", type: "incident" },
    { time: "5 min atrás", text: "Viatura 001 chegou ao local do incidente", type: "dispatch" },
    { time: "12 min atrás", text: "Incidente #1234 foi encerrado com sucesso", type: "success" },
    { time: "15 min atrás", text: "Nova viatura adicionada ao sistema", type: "info" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'incident': return <WarningIcon />;
      case 'dispatch': return <LocalShippingIcon />;
      case 'success': return <CheckCircleIcon />;
      case 'info': return <DirectionsCarIcon />;
      default: return <PeopleIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'incident': return 'warning.main';
      case 'dispatch': return 'info.main';
      case 'success': return 'success.main';
      case 'info': return 'primary.main';
      default: return 'grey.500';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Cards de Estatísticas */}
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: stat.changeColor, fontWeight: 'bold' }}>
                    {stat.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs. mês anterior
                  </Typography>
                </Box>
                                 <LinearProgress 
                   variant="determinate" 
                   value={stat.progress} 
                   sx={{ 
                     mt: 1, 
                     height: 6, 
                     backgroundColor: 'grey.200',
                     '& .MuiLinearProgress-bar': {
                       backgroundColor: stat.color,
                     }
                   }} 
                 />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Gráfico de Tendências */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                  Tendência de Incidentes
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Últimos 30 dias
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Gráfico de tendências será implementado aqui
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Atividades Recentes */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Atividades Recentes
            </Typography>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getActivityColor(activity.type), width: 32, height: 32 }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.text}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
