import { Box, Drawer, Typography } from "@mui/material";
import React from "react";

function CommonDrawer({ modalHeader, children, ...otherProps }) {
  return (
    <Drawer anchor="right" {...otherProps}>
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          height: "100%",
          width: "300px",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          {modalHeader}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
}

export default CommonDrawer;
