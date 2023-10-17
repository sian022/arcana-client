import { Box, Modal } from "@mui/material";
import React from "react";

function CommonModal({ children, ...otherProps }) {
  return (
    <Modal {...otherProps}>
      <Box className="commonModal">{children}</Box>
    </Modal>
  );
}

export default CommonModal;
