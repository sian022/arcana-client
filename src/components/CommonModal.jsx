import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import React from "react";

function CommonModal({
  customRibbonContent,
  disablePadding,
  paddingCustom,
  width,
  ribbon,
  children,
  height,
  maxHeight,
  closeTopRight,
  customOnClose,
  ...otherProps
}) {
  const { onClose, ...noOnCloseProps } = otherProps;

  return (
    <Modal {...noOnCloseProps}>
      <Box
        sx={{
          width: width ? width : "500px",
          padding: disablePadding
            ? "0 !important"
            : paddingCustom
            ? paddingCustom
            : "30px",
          height: height && height,
          maxHeight: maxHeight && maxHeight,
        }}
        className="commonModal"
      >
        {closeTopRight && (
          <Box
            // sx={{ display: "flex", justifyContent: "end" }}
            sx={{
              position: "absolute",
              right: "20px",
              top: "20px",
            }}
          >
            <IconButton onClick={customOnClose ? customOnClose : onClose}>
              <Close />
            </IconButton>
          </Box>
        )}
        {ribbon && (
          <Box className="commonModal__ribbon">
            {customRibbonContent && customRibbonContent}
          </Box>
        )}
        {children}
      </Box>
    </Modal>
  );
}

export default CommonModal;
