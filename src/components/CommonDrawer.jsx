import { Close } from "@mui/icons-material";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";

function CommonDrawer({ onClose, drawerHeader, children, ...otherProps }) {
  return (
    <Drawer anchor="right" {...otherProps}>
      <Box className="commonDrawer">
        <Box className="commonDrawer__ribbon">
          <Typography className="commonDrawer__ribbon__title">
            {drawerHeader}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box className="commonDrawer__body">{children}</Box>
        <Box className="commonDrawer__actions">
          <SecondaryButton>Submit</SecondaryButton>
          <DangerButton onClick={onClose}>Close</DangerButton>
        </Box>
      </Box>
    </Drawer>
  );
}

export default CommonDrawer;
