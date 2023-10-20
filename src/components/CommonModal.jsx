import { Box, Modal } from "@mui/material";
import React from "react";

function CommonModal({ width, children, ...otherProps }) {
  return (
    <Modal {...otherProps}>
      <Box sx={{ width: width ? width : "500px" }} className="commonModal">
        {children}
      </Box>
    </Modal>
  );
}

export default CommonModal;
