import { Fragment, createContext, useCallback, useState } from "react";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Close, WarningAmberRounded } from "@mui/icons-material";

import useDisclosure from "../hooks/useDisclosure";

export const ReasonConfirmContext = createContext();

const ReasonConfirmProvider = ({ children }) => {
  const { open: isLoading, onToggle: handleLoading } = useDisclosure(false);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState({
    children: "Are you sure you want to proceed?",
  });
  const [promise, setPromise] = useState([]);
  const [resolve, reject, callback] = promise;

  const reason = useCallback((params = {}) => {
    const { callback, ...options } = params;

    return new Promise((resolve, reject) => {
      setOptions((currentValue) => ({
        ...currentValue,
        ...options,
      }));

      setPromise([resolve, reject, callback]);
    });
  }, []);

  const handleClose = useCallback(() => {
    setPromise([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      reject({
        isConfirmed: false,
        isCancelled: true,
        result: null,
      });
    }

    handleClose();
  }, [reject, handleClose]);

  const handleConfirm = useCallback(() => {
    if (callback) {
      handleLoading();
      callback(value)
        .then((result) =>
          resolve({
            isConfirmed: true,
            isCancelled: false,
            result: result,
          })
        )
        .catch((error) =>
          reject({
            isConfirmed: true,
            isCancelled: false,
            error: error,
          })
        )
        .finally(() => {
          handleLoading();
          handleClose();
        });
    } else if (resolve) {
      resolve({
        isConfirmed: true,
        isCancelled: false,
        result: null,
      });
      handleClose();
    }
  }, [value, resolve, reject, callback, handleClose, handleLoading]);

  return (
    <Fragment>
      <ReasonConfirmContext.Provider value={{ reason }}>
        {children}
      </ReasonConfirmContext.Provider>

      <Dialog open={promise.length === 3} maxWidth="xs">
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {options.title}
            </Typography>

            <IconButton
              disabled={isLoading}
              onClick={handleCancel}
              size="large"
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack direction="row" alignItems="center" gap={2} marginBottom={2}>
            <WarningAmberRounded sx={{ fontSize: 54 }} />

            <Typography variant="body1">{options.description}</Typography>
          </Stack>

          <TextField
            label="Write reason"
            value={value}
            rows={2}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            multiline
          />
        </DialogContent>

        <DialogActions>
          <Button disabled={isLoading} onClick={handleCancel}>
            No
          </Button>

          <Button
            variant="contained"
            startIcon={
              isLoading && (
                <CircularProgress color="inherit" size={16} thickness={4} />
              )
            }
            disabled={isLoading || !value}
            onClick={handleConfirm}
            disableElevation
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ReasonConfirmProvider;
