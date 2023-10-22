import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/theme";
import { router } from "./navigation/router";
import "./assets/styles/common.styles.scss";
import { AppProvider } from "./context/AppContext";
import { AttachmentsProvider } from "./context/AttachmentsContext";

function App() {
  return (
    <AppProvider>
      <AttachmentsProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AttachmentsProvider>
    </AppProvider>
  );
}

export default App;
