import { createContext, useCallback, useState } from "react";
import CommonDialog from "../components/CommonDialog";

const ConfirmContext = createContext();

let confirmGlobal;

const ConfirmProvider = ({ children }) => {
  const [resolveReject, setResolveReject] = useState([]);
  const [options, setOptions] = useState({});
  const [resolve, reject] = resolveReject;
  const [key, setKey] = useState(0);

  const confirm = useCallback(
    (
      options = {
        children: "Are you sure?",
      }
    ) => {
      return new Promise((resolve, reject) => {
        setKey((key) => key + 1);
        setOptions(options);
        setResolveReject([resolve, reject]);
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setResolveReject([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      reject();
      handleClose();
    }
  }, [reject, handleClose]);

  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve();
      handleClose();
    }
  }, [resolve, handleClose]);

  confirmGlobal = confirm;

  return (
    <>
      <ConfirmContext.Provider value={confirm}>
        {children}

        <CommonDialog
          key={key}
          open={resolveReject.length === 2}
          onClose={handleCancel}
          onYes={handleConfirm}
        />
      </ConfirmContext.Provider>
    </>
  );
};

export { ConfirmContext, ConfirmProvider };
export { confirmGlobal as confirm };
