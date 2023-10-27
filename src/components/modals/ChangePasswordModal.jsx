import React from "react";
import CommonModal from "../CommonModal";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import { Box, TextField, Typography } from "@mui/material";

function ChangePasswordModal({ ...otherProps }) {
  const { onClose, ...noOnClose } = otherProps;

  return (
    <CommonModal {...otherProps}>
      <Box className="changePasswordModal">
        <Typography className="changePasswordModal__title">
          Change User Password
        </Typography>
        <Box className="changePasswordModal__form">
          <TextField size="small" label="Old Password" />
          <TextField size="small" label="New Password" />
          <TextField size="small" label="Confirm New Password" />
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "end", gap: "10px" }}
          className="roleTaggingModal__actions"
        >
          <SecondaryButton onClick={onClose}>Save</SecondaryButton>
          <DangerButton onClick={onClose}>Close</DangerButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ChangePasswordModal;
