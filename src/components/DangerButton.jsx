import { Button } from "@mui/material";
import React from "react";

function DangerButton({ children, ...otherProps }) {
  return (
    <Button size="small" variant="contained" color="error" {...otherProps}>
      {children}
    </Button>
  );
}

export default DangerButton;
