import React, { createContext, useState, useEffect } from "react";
import CommonSnackbar from "../components/CommonSnackbar";
import useDisclosure from "../hooks/useDisclosure";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState("success");

  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  return (
    <AppContext.Provider
      value={{ setSnackbarMessage, setSnackbarVariant, onSnackbarOpen }}
    >
      <>
        {children}
        <CommonSnackbar
          message={snackbarMessage}
          variant={snackbarVariant}
          open={isSnackbarOpen}
          onClose={onSnackbarClose}
        />
      </>
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
