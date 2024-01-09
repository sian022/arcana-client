import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import React from "react";

function CommonModalForm({ title, width, height, children, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  return (
    <Modal {...noOnCloseProps}>
      <Box
        sx={{
          width: width ? width : "500px",
          height: height && height,
        }}
        className="commonModalForm"
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
      </Box>
    </Modal>
  );
}

export default CommonModalForm;
