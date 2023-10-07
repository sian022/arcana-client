import { Close } from "@mui/icons-material";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";

function CommonDrawer({ onClose, modalHeader, children, ...otherProps }) {
  return (
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
            gap: "20px",
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
          }}
        >
          <SecondaryButton>Submit</SecondaryButton>
          <DangerButton>Close</DangerButton>
        </Box>
      </Box>
    </Drawer>
  );
}

export default CommonDrawer;
