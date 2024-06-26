import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import DangerButton from "./DangerButton";
import SecondaryButton from "./SecondaryButton";

function CommonModalForm({
  disableSubmit,
  isLoading,
  onSubmit,
  title,
  width,
  height,
  children,
  ...otherProps
}) {
  const { onClose, ...noOnCloseProps } = otherProps;

  return (
    <Modal {...noOnCloseProps}>
      <Box
        sx={{
          width: width ? width : "500px",
          height: height && height,
        }}
        className="commonModalForm"
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Box className="commonModalForm__ribbon">
          <Typography className="commonModalForm__ribbon__title">
            {title}
          </Typography>

          <IconButton onClick={onClose} sx={{ color: "white !important" }}>
            <Close />
          </IconButton>
        </Box>

        <Box className="commonModalForm__content">{children}</Box>

        <Box className="commonModalForm__actions">
          <DangerButton onClick={onClose}>Close</DangerButton>
          <SecondaryButton type="submit" disabled={disableSubmit}>
            {isLoading ? <CircularProgress size="20px" /> : "Submit"}
          </SecondaryButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default CommonModalForm;
