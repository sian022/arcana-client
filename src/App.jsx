import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/theme";
import { router } from "./navigation/router";
import "./assets/styles/common.styles.scss";
import { AppProvider } from "./context/AppContext";
import { AttachmentsProvider } from "./context/AttachmentsContext";
import { DirectReleaseProvider } from "./context/DirectReleaseContext";

function App() {
  return (
    <AppProvider>
      <AttachmentsProvider>
        <DirectReleaseProvider>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </DirectReleaseProvider>
      </AttachmentsProvider>
    </AppProvider>
  );
}

export default App;
