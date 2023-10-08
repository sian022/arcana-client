import { Close } from "@mui/icons-material";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import useDisclosure from "../hooks/useDisclosure";
import CommonDialog from "./CommonDialog";

function CommonDrawer({ onClose, modalHeader, children, ...otherProps }) {
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const handleCloseDrawer = () => {
    onClose();
    onDialogClose();
  };

  return (
    <>
      <Drawer anchor="right" {...otherProps}>
        <Box className="commonDrawer">
          <Box className="commonDrawer__ribbon">
            <Typography className="commonDrawer__ribbon__title">
              {modalHeader}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Box className="commonDrawer__body">{children}</Box>
          <Box className="commonDrawer__actions">
            <SecondaryButton>Submit</SecondaryButton>
            <DangerButton onClick={onDialogOpen}>Close</DangerButton>
          </Box>
        </Box>
      </Drawer>

      <CommonDialog
        open={isDialogOpen}
        onClose={onDialogClose}
        onYes={handleCloseDrawer}
      >
        Are you sure you want to exit?
      </CommonDialog>
    </>
  );
}

export default CommonDrawer;
