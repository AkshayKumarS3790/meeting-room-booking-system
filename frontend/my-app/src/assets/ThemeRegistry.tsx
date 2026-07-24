"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#7C4DFF",
          },
          background: {
            default: "#121212",
            paper: "#1E1E2F",
          },
        },
        // shape: {
        //   borderRadius: 10,
        // },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
