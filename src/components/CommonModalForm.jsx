import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import SuccessButton from "./SuccessButton";
import DangerButton from "./DangerButton";

function CommonModalForm({
  disableSubmit,
  isLoading,
  onSubmit,
  title,
  width,
  height,
  children,
  ...otherProps
}) {
  const { onClose, ...noOnCloseProps } = otherProps;

  return (
    <Modal {...noOnCloseProps}>
      <Box
        sx={{
          width: width ? width : "500px",
          height: height && height,
        }}
        className="commonModalForm"
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Box className="commonModalForm__ribbon">
          <Typography className="commonModalForm__ribbon__title">
            {title}
          </Typography>

          <IconButton onClick={onClose} sx={{ color: "white !important" }}>
            <Close />
          </IconButton>
        </Box>

        <Box className="commonModalForm__content">{children}</Box>

        <Box className="commonModalForm__actions">
          <DangerButton onClick={onClose}>Close</DangerButton>
          <SuccessButton type="submit" disabled={disableSubmit}>
            {isLoading ? <CircularProgress size="20px" /> : "Submit"}
          </SuccessButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default CommonModalForm;
