import { Button } from "@mui/material";
import React from "react";

function TertiaryButton({ sx, children, ...otherProps }) {
  return (
    <Button
      variant="contained"
      color="tertiary"
      sx={{ color: "white !important", ...sx }}
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default TertiaryButton;