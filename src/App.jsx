import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/theme";
import { router } from "./navigation/router";
import "./assets/styles/common.styles.scss";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
