import { Box, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";

function CommonDialog({ onClose, onYes, children, ...otherProps }) {
  return (
    <Dialog {...otherProps}>
      <Box
        sx={{
          backgroundColor: "primary.main",
          height: "1rem",
        }}
      />
      <Box sx={{ padding: "20px" }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>{children}</DialogTitle>
        <DialogActions>
          <SecondaryButton onClick={onYes}>Yes</SecondaryButton>
          <DangerButton onClick={onClose}>No</DangerButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CommonDialog;
