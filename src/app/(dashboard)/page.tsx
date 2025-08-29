import { Card, CardContent, Grid, Typography } from "@mui/material";

export default async function DashboardHome() {
  return (
    <Grid container spacing={2}>
      {[
        { label: "Incidentes abertos", value: "—" },
        { label: "Em despacho", value: "—" },
        { label: "Encerrados hoje", value: "—" },
      ].map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={k.label}>
          <Card>
            <CardContent>
              <Typography variant="overline">{k.label}</Typography>
              <Typography variant="h4">{k.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
