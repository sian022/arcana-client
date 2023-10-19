import { Box, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import SecondaryAlert from "../assets/images/SecondaryAlert.png";

function CommonDialog({
  onClose,
  onYes,
  children,
  noIcon,
  customImageSource,
  ...otherProps
}) {
  return (
    <Dialog {...otherProps}>
      <Box className="commonDialog__roof" />
      <Box className="commonDialog__content">
        {!noIcon && (
          <Box className="commonDialog__imageWrapper">
            <img
              src={customImageSource ? customImageSource : SecondaryAlert}
              alt="alert-img"
            />
          </Box>
        )}
        <DialogTitle className="commonDialog__title">{children}</DialogTitle>
        <DialogActions>
          <SecondaryButton onClick={onYes}>Yes</SecondaryButton>
          <DangerButton onClick={onClose}>No</DangerButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CommonDialog;
