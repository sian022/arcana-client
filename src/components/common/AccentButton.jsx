import { Button } from "@mui/material";

function AccentButton({ children, ...otherProps }) {
  return (
    <Button variant="contained" color="accent" size="small" {...otherProps}>
      {children}
    </Button>
  );
}

export default AccentButton;
