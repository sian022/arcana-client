import { Button } from "@mui/material";
import React from "react";

function AccentButton({ children, ...otherProps }) {
  return (
    <Button variant="contained" color="accent" {...otherProps}>
      {children}
    </Button>
  );
}

export default AccentButton;
