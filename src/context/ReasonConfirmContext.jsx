import { createContext, useCallback, useState } from "react";
import CommonDialog from "../components/common/CommonDialog";
import { Box, TextField } from "@mui/material";

const ReasonConfirmContext = createContext();

// let confirmGlobal;

const ReasonConfirmProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [promise, setPromise] = useState([]);
  const [options, setOptions] = useState({
    children: "Are you sure you want to proceed?",
  });
  const [resolve, reject, callback] = promise;
  const [key, setKey] = useState(0);

  const [value, setValue] = useState("");

  const confirm = useCallback((params = {}) => {
    const { callback, ...options } = params;

    return new Promise((resolve, reject) => {
      setKey((key) => key + 1);
      setOptions((defaultValue) => ({
        ...defaultValue,
        ...options,
        children: (
          <>
            {options.children}{" "}
            <Box>
              <TextField
                sx={{ mt: 2 }}
                onChange={(e) => setValue(e.target.value)}
                size="small"
                label="Reason"
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </>
        ),
      }));
      setPromise([resolve, reject, callback]);
    });
  }, []);

  const handleClose = useCallback(() => {
    setPromise([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      reject({ isConfirmed: false, isCancelled: true, result: null });
      handleClose();
    }
  }, [reject, handleClose]);

  const handleConfirm = useCallback(async () => {
    if (callback) {
      setIsLoading(true);
      try {
        const result = await callback(value);
        resolve({
          isConfirmed: true,
          isCancelled: false,
          ...result,
        });
      } catch (error) {
        reject({
          isConfirmed: true,
          isCancelled: false,
          ...error,
        });
      }

      setIsLoading(false);
      handleClose();
    } else if (resolve) {
      resolve({
        isConfirmed: true,
        isCancelled: false,
        result: null,
      });

      handleClose();
    }
  }, [resolve, reject, callback, handleClose, value]);

  // confirmGlobal = confirm;

  return (
    <>
      <ReasonConfirmContext.Provider value={confirm}>
        {children}

        <CommonDialog
          key={key}
          open={promise.length === 3}
          onClose={handleCancel}
          onYes={handleConfirm}
          isLoading={isLoading}
          {...options}
          disableYes={!value}
        />
      </ReasonConfirmContext.Provider>
    </>
  );
};

export { ReasonConfirmContext, ReasonConfirmProvider };
