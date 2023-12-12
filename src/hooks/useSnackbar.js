import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const useSnackbar = () => {
  const { setSnackbarMessage, setSnackbarVariant, onSnackbarOpen } =
    useContext(AppContext);

  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setSnackbarVariant(variant);
    onSnackbarOpen();
  };

  const closeSnackbar = () => {
    setSnackbarMessage("");
    setSnackbarVariant("success");
  };

  return { showSnackbar, closeSnackbar };
};

export default useSnackbar;
