import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const useSnackbar = () => {
  const { setSnackbarMessage, setSnackbarVariant, onSnackbarOpen } =
    useContext(AppContext);

  return ({ message, variant }) => {
    setSnackbarMessage(message);
    setSnackbarVariant(variant);
    onSnackbarOpen();
  };
};

export default useSnackbar;
