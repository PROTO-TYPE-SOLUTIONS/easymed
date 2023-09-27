import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import "devextreme/dist/css/dx.material.blue.light.css";
import "../styles/devextreme.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </LocalizationProvider>
  );
}
