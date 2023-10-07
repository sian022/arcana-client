import { Button } from "@mui/material";
import React from "react";

function SecondaryButton({ children, ...otherProps }) {
  return (
    <Button variant="contained" color="secondary" {...otherProps}>
      {children}
    </Button>
  );
}

export default SecondaryButton;
