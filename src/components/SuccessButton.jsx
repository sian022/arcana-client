import { Button } from "@mui/material";
import React from "react";

function SuccessButton({ medium, children, ...otherProps }) {
  return (
    <Button
      size={medium ? "medium" : "small"}
      variant="contained"
      color="success"
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default SuccessButton;
