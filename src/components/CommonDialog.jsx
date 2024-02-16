import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import ErrorAlert from "../assets/images/ErrorAlert.png";
import QuestionAlert from "../assets/images/QuestionAlert.png";

function CommonDialog({
  onClose,
  onYes,
  children,
  question,
  customImageSource,
  isLoading,
  disableYes,
  ...otherProps
}) {
  const handleYes = (e) => {
    e.preventDefault();
    onYes();
  };

  return (
    <Dialog {...otherProps}>
      <Box className="commonDialog">
        <Box className="commonDialog__roof" />

        <Box
          className="commonDialog__content"
          component="form"
          onSubmit={handleYes}
        >
          <Box
            className={
              question
                ? "commonDialog__imageWrapperQuestion"
                : "commonDialog__imageWrapper"
            }
          >
            <img
              src={
                customImageSource
                  ? customImageSource
                  : question
                  ? QuestionAlert
                  : // : SecondaryAlert
                    ErrorAlert
              }
              alt="alert-img"
            />
          </Box>

          <DialogTitle className="commonDialog__title">{children}</DialogTitle>
          <DialogActions>
            <DangerButton onClick={onClose} disabled={isLoading}>
              No
            </DangerButton>

            <SecondaryButton type="submit" disabled={isLoading || disableYes}>
              {isLoading ? (
                <CircularProgress size="20px" color="white" />
              ) : (
                "Yes"
              )}
            </SecondaryButton>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

export default CommonDialog;
