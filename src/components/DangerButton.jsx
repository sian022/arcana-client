import { Button } from "@mui/material";
import React from "react";

function DangerButton({ children, contained, ...otherProps }) {
  return (
    <Button
      size="small"
      // variant="contained"
      variant={contained ? "contained" : "outlined"}
      color="error"
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default DangerButton;
