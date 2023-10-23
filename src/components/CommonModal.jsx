import { Box, Modal } from "@mui/material";
import React from "react";

function CommonModal({
  customRibbonContent,
  disablePadding,
  paddingCustom,
  width,
  ribbon,
  children,
  ...otherProps
}) {
  return (
    <Modal {...otherProps}>
      <Box
        sx={{
          width: width ? width : "500px",
          padding: disablePadding
            ? "0 !important"
            : paddingCustom
            ? paddingCustom
            : "30px",
        }}
        className="commonModal"
      >
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
