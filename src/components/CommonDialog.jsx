import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import SecondaryAlert from "../assets/images/SecondaryAlert.png";
import ErrorAlert from "../assets/images/ErrorAlert.png";
import WarningAlert from "../assets/images/WarningAlert.png";
import QuestionAlert from "../assets/images/QuestionAlert.png";
import SuccessButton from "./SuccessButton";

function CommonDialog({
  onClose,
  onYes,
  children,
  noIcon,
  customImageSource,
  isLoading,
  disableYes,
  ...otherProps
}) {
  return (
    <Dialog {...otherProps}>
      <Box className="commonDialog__roof" />
      <Box className="commonDialog__content" component="form" onSubmit={onYes}>
        {/* {!noIcon && (
          <Box className="commonDialog__imageWrapper">
            <img
              src={customImageSource ? customImageSource : SecondaryAlert}
              alt="alert-img"
            />
          </Box>
        )} */}

        <Box
          className={
            noIcon
              ? "commonDialog__imageWrapperQuestion"
              : "commonDialog__imageWrapper"
          }
        >
          <img
            src={
              customImageSource
                ? customImageSource
                : noIcon
                ? QuestionAlert
                : // : SecondaryAlert
                  ErrorAlert
            }
            alt="alert-img"
          />
        </Box>

        <DialogTitle className="commonDialog__title">{children}</DialogTitle>
        <DialogActions>
          <SecondaryButton type="submit" disabled={isLoading || disableYes}>
            {isLoading ? <CircularProgress size="20px" color="white" /> : "Yes"}
          </SecondaryButton>
          <DangerButton onClick={onClose} disabled={isLoading}>
            No
          </DangerButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CommonDialog;
