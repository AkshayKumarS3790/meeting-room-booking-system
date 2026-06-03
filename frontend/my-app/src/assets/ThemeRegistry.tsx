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
      shape: {
        borderRadius: 10,
      },
    }),
  [],
);
