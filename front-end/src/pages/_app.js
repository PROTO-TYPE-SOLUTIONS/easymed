import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/styles/theme";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}
