import { Close } from "@mui/icons-material";
import { IconButton, Snackbar } from "@mui/material";
import React from "react";

function ErrorSnackbar({ ...otherProps }) {
  const { onClose } = otherProps;
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      {...otherProps}
      sx={{
        "& .MuiSnackbarContent-root": {
          bgcolor: "error.main",
          fontWeight: "bold",
        },
      }}
      action={
        <IconButton sx={{ color: "white !important" }} onClick={onClose}>
          <Close />
        </IconButton>
      }
    />
  );
}

export default ErrorSnackbar;
