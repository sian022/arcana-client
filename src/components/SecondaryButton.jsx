import { Button } from "@mui/material";
import React from "react";

function SecondaryButton({ medium, children, ...otherProps }) {
  return (
    <Button
      size={medium ? "medium" : "small"}
      variant="contained"
      color="secondary"
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default SecondaryButton;
