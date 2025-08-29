import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { variant: "contained" } },
  },
});

export default theme;
