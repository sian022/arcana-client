import React, { useRef } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import SecondaryButton from "../SecondaryButton";

function RegistrationApprovalHistoryModal({ ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const steps = [
    "Requested",
    "1st Approval",
    "2nd Approval",
    "Registered Client",
  ];

  return (
    <CommonModal width="700px" {...otherProps} closeTopRight>
      <Box className="approvalHistoryModal">
        <Typography className="approvalHistoryModal__title">
          Approval History
        </Typography>
        <Box className="approvalHistoryModal__content">
          <Box className="approvalHistoryModal__content__headStepper">
            <Stepper alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} activeStep={0}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box className="approvalHistoryModal__content__body">
            <Stepper orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label} activeStep={0}>
                  <StepLabel sx={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "-170px" }}>
                      November 17 11:47
                    </span>
                    {label}
                  </StepLabel>
                  <StepContent>Pangit yung store owner</StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
          {/* <Box className="approvalHistoryModal__content__body">
            <Box className="approvalHistoryModal__content__body__item">
              <Typography className="approvalHistoryModal__content__body__item__title">
                Registration
              </Typography>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Name:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Department:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Position:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>
            </Box>

            <Box className="approvalHistoryModal__content__body__item">
              <Typography className="approvalHistoryModal__content__body__item__title">
                Registration
              </Typography>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Name:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Department:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Position:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>
            </Box>

            <Box className="approvalHistoryModal__content__body__item">
              <Typography className="approvalHistoryModal__content__body__item__title">
                Registration
              </Typography>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Name:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Department:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>

              <Box className="approvalHistoryModal__content__body__item__subs">
                <Typography className="approvalHistoryModal__content__body__item__subs__label">
                  Position:
                </Typography>
                <Typography className="approvalHistoryModal__content__body__item__subs__value">
                  Sian Dela Cruz
                </Typography>
              </Box>
            </Box>
          </Box> */}
        </Box>
      </Box>
      {/* <Box className="approvalHistoryModal__actions">
        <SecondaryButton onClick={onClose}>Confirm</SecondaryButton>
      </Box> */}
    </CommonModal>
  );
}

export default RegistrationApprovalHistoryModal;
