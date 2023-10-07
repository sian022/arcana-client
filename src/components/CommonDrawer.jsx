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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "350px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "primary.main",
              padding: "20px",
              marginTop: "30px",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "white !important",
              }}
            >
              {modalHeader}
            </Typography>
            <IconButton sx={{ color: "white !important" }} onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              padding: "30px",
              overflow: "auto",
            }}
          >
            {children}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              padding: "30px",
              justifyContent: "end",
            }}
          >
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
