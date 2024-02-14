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
      <Box className="commonDialog__roof" />
      <Box
        className="commonDialog__content"
        component="form"
        onSubmit={handleYes}
      >
        {/* {!question && (
          <Box className="commonDialog__imageWrapper">
            <img
              src={customImageSource ? customImageSource : SecondaryAlert}
              alt="alert-img"
            />
          </Box>
        )} */}

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
            {isLoading ? <CircularProgress size="20px" color="white" /> : "Yes"}
          </SecondaryButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CommonDialog;
