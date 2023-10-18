import { Close } from "@mui/icons-material";
import { Button, IconButton, Snackbar } from "@mui/material";
import React from "react";

function SuccessSnackbar({ ...otherProps }) {
  const { onClose } = otherProps;

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      {...otherProps}
      sx={{
        "& .MuiSnackbarContent-root": {
          bgcolor: "success.main",
          fontWeight: "600",
        },
      }}
      autoHideDuration={2000}
      action={
        <IconButton sx={{ color: "white !important" }} onClick={onClose}>
          <Close />
        </IconButton>
      }
    />
  );
}

export default SuccessSnackbar;
