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
import ReasonConfirmProvider from "./context/ReasonConfirmContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <ConfirmProvider>
          <ReasonConfirmProvider>
            <AttachmentsProvider>
              <DirectReleaseProvider>
                <RouterProvider router={router} />
              </DirectReleaseProvider>
            </AttachmentsProvider>
          </ReasonConfirmProvider>
        </ConfirmProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
