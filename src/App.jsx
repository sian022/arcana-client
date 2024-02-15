import "./App.css";
import "./assets/styles/common.styles.scss";
import { theme } from "./theme/theme";
import { router } from "./navigation/router";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { AppProvider } from "./context/AppContext";
import { AttachmentsProvider } from "./context/AttachmentsContext";
import { DirectReleaseProvider } from "./context/DirectReleaseContext";
import { ConfirmProvider } from "./context/ConfirmContext";

function App() {
  return (
    <AppProvider>
      <ConfirmProvider>
        <AttachmentsProvider>
          <DirectReleaseProvider>
            <ThemeProvider theme={theme}>
              <RouterProvider router={router} />
            </ThemeProvider>
          </DirectReleaseProvider>
        </AttachmentsProvider>
      </ConfirmProvider>
    </AppProvider>
  );
}

export default App;
