import { createContext, useState, useEffect } from "react";
import CommonSnackbar from "../components/CommonSnackbar";
import useDisclosure from "../hooks/useDisclosure";
import { useGetNotificationsQuery } from "../features/notification/api/notificationApi";
import { decryptString } from "../utils/CustomFunctions";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState("success");

  const [notifications, setNotifications] = useState({});
  const userId = decryptString(sessionStorage.getItem("userDetails"))?.id;

  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  const {
    data: notificationData,
    isFetching: isNotificationFetching,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();

  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData);
    }
  }, [notificationData]);

  return (
    <AppContext.Provider
      value={{
        setSnackbarMessage,
        setSnackbarVariant,
        onSnackbarOpen,
        notifications,
        setNotifications,
        isNotificationFetching,
        refetchNotifications,
        userId,
      }}
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
