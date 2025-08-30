"use client";
import * as React from "react";
import { 
  Grid, Card, CardContent, Typography, Box, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, LinearProgress, Stack, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PercentIcon from '@mui/icons-material/Percent';
import type { Incident } from "@/types/incidents.interface";
import type { Unit } from "@/types/units.interface";
import TrendsChart from "./TrendsChart";
import { JSX } from "@emotion/react/jsx-runtime";

type Props = {
  open: Incident[];
  inDispatch: Incident[];
  resolved: Incident[];
  units: Unit[];
};

export default function DashboardMetrics({ open, inDispatch, resolved, units }: Props) {
  const [period, setPeriod] = React.useState<7 | 30 | 90>(30);

  // Use a fixed locale + options to avoid SSR/CSR hydration mismatches
  const formatDateTime = React.useCallback((input: string | number | Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date(input));
  }, []);

  const tIncidentStatus = (s?: string) => {
    switch (s) {
      case 'OPEN': return 'Aberto';
      case 'IN_DISPATCH': return 'Em Despacho';
      case 'RESOLVED': return 'Resolvido';
      case 'CANCELED': return 'Cancelado';
      default: return s || '';
    }
  };

  // Faixas de mês atual e anterior (para os cards)
  const monthRanges = React.useMemo(() => {
    const now = new Date();
    const cmStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const cmEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
    const pmStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const pmEnd = cmStart;
    return { cmStart, cmEnd, pmStart, pmEnd };
  }, []);

  const inMonth = (d: string | number | Date, start: Date, end: Date) => {
    const x = new Date(d).getTime();
    return x >= start.getTime() && x < end.getTime();
  };

  const cmOpen = open.filter(i => inMonth(i.createdAt, monthRanges.cmStart, monthRanges.cmEnd));
  const pmOpen = open.filter(i => inMonth(i.createdAt, monthRanges.pmStart, monthRanges.pmEnd));
  const cmInDisp = inDispatch.filter(i => inMonth(i.createdAt, monthRanges.cmStart, monthRanges.cmEnd));
  const pmInDisp = inDispatch.filter(i => inMonth(i.createdAt, monthRanges.pmStart, monthRanges.pmEnd));
  const cmResolved = resolved.filter(i => inMonth(i.updatedAt, monthRanges.cmStart, monthRanges.cmEnd));
  const pmResolved = resolved.filter(i => inMonth(i.updatedAt, monthRanges.pmStart, monthRanges.pmEnd));
  const activeUnits = units.filter(u => u.active).length;

  const cmTotalCreated = cmOpen.length + cmInDisp.length + cmResolved.length;
  const pmTotalCreated = pmOpen.length + pmInDisp.length + pmResolved.length;
  const cmResolutionRate = cmTotalCreated ? Math.round((cmResolved.length / cmTotalCreated) * 100) : 0;
  const pmResolutionRate = pmTotalCreated ? Math.round((pmResolved.length / pmTotalCreated) * 100) : 0;
  const cmAvgResolutionMin = (() => {
    const list = cmResolved;
    if (!list.length) return 0;
    const sum = list.reduce((acc, i) => acc + (new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime()), 0);
    return Math.round(sum / list.length / 60000);
  })();
  const pmAvgResolutionMin = (() => {
    const list = pmResolved;
    if (!list.length) return 0;
    const sum = list.reduce((acc, i) => acc + (new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime()), 0);
    return Math.round(sum / list.length / 60000);
  })();

  const days = React.useMemo(() => {
    const n = period;
    const out: { date: string; count: number }[] = [];
    const d = new Date();
    for (let i=n-1; i>=0; i--) {
      const ref = new Date(d);
      ref.setDate(d.getDate() - i);
      ref.setHours(0,0,0,0);
      const next = new Date(ref); next.setDate(ref.getDate()+1);
      const all = [...open, ...inDispatch, ...resolved];
      const count = all.filter(x => {
        const c = new Date(x.createdAt);
        return c >= ref && c < next;
      }).length;
      out.push({ date: ref.toISOString().slice(0,10), count });
    }
    return out;
  }, [open, inDispatch, resolved, period]);

  // Atividades do dia
  const recentActivities = React.useMemo(() => {
    const now = new Date();
    const start = new Date(now); start.setHours(0,0,0,0);
    const end = new Date(now); end.setHours(23,59,59,999);
    const all = [...open, ...inDispatch, ...resolved]
      .filter(i => inMonth(i.createdAt, start, end))
      .slice()
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(i => ({ time: formatDateTime(i.createdAt), text: `Incidente ${i.code || i.id} (${tIncidentStatus(i.status)})`, type: i.status === 'OPEN' ? 'incident' : i.status === 'IN_DISPATCH' ? 'dispatch' : 'success' }));
    return all;
  }, [open, inDispatch, resolved, formatDateTime]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'incident': return <WarningIcon />;
      case 'dispatch': return <LocalShippingIcon />;
      case 'success': return <CheckCircleIcon />;
      default: return <DirectionsCarIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'incident': return 'warning.main';
      case 'dispatch': return 'info.main';
      case 'success': return 'success.main';
      default: return 'primary.main';
    }
  };

  type Stat = { label: string; value: string; prev?: number | string; icon: JSX.Element; color: string; progress: number };
  const stats: Stat[] = [
    { label: "Incidentes Abertos (mês)", value: String(cmOpen.length), prev: pmOpen.length, icon: <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />, color: 'warning.main', progress: Math.min(100, cmOpen.length * 5) },
    { label: "Em Despacho (mês)", value: String(cmInDisp.length), prev: pmInDisp.length, icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'info.main' }} />, color: 'info.main', progress: Math.min(100, cmInDisp.length * 5) },
    { label: "Encerrados no Mês", value: String(cmResolved.length), prev: pmResolved.length, icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />, color: 'success.main', progress: Math.min(100, cmResolved.length * 5) },
    { label: "Viaturas Ativas", value: String(activeUnits), prev: undefined, icon: <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main' }} />, color: 'primary.main', progress: Math.min(100, activeUnits * 5) },
    { label: "Taxa de Resolução (mês)", value: `${cmResolutionRate}%`, prev: `${pmResolutionRate}%`, icon: <PercentIcon sx={{ fontSize: 40, color: 'secondary.main' }} />, color: 'secondary.main', progress: cmResolutionRate },
    { label: "Tempo Médio (min)", value: String(cmAvgResolutionMin), prev: pmAvgResolutionMin, icon: <AccessTimeIcon sx={{ fontSize: 40, color: 'grey.700' }} />, color: 'grey.700', progress: Math.min(100, (cmAvgResolutionMin/60)*100) },
  ];

  return (
    <Grid container spacing={3}>
      

      {stats.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.label}>
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
                  {typeof stat.prev !== 'undefined' && (
                    <Typography variant="caption" color="text.secondary">Mês anterior: {stat.prev}</Typography>
                  )}
                </Box>
                {stat.icon}
              </Box>
              <LinearProgress variant="determinate" value={stat.progress} sx={{ mt: 1, height: 6 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Tendência de Incidentes</Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">Período:</Typography>
              <ToggleButtonGroup exclusive size="small" value={period} onChange={(_, v)=> v && setPeriod(v)}>
                <ToggleButton value={7}>7 dias</ToggleButton>
                <ToggleButton value={30}>30 dias</ToggleButton>
                <ToggleButton value={90}>90 dias</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TrendsChart data={days} />
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Atividades de Hoje</Typography>
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
  );
}
