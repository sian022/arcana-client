import { Button } from "@mui/material";

function TertiaryButton({ sx, children, ...otherProps }) {
  return (
    <Button
      variant="contained"
      color="tertiary"
      size="small"
      sx={{ color: "white !important", ...sx }}
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default TertiaryButton;
