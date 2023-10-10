import { Snackbar } from "@mui/material";
import React from "react";

function SuccessSnackbar({ ...otherProps }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      {...otherProps}
      sx={{
        "& .MuiSnackbarContent-root": {
          bgcolor: "success.main",
          fontWeight: "bold",
        },
      }}
    />
  );
}

export default SuccessSnackbar;
