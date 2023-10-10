import { Snackbar } from "@mui/material";
import React from "react";

function ErrorSnackbar({ ...otherProps }) {
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
    />
  );
}

export default ErrorSnackbar;
