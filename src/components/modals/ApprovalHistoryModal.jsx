import React, { useRef } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  Step,
  StepButton,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Check, CheckCircle, EventNote, HowToReg } from "@mui/icons-material";

function ApprovalHistoryModal({ ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const steps = [
    { label: "Requested", icon: <EventNote /> },
    { label: "1st Approval", icon: <Check /> },
    { label: "2nd Approval", icon: <CheckCircle /> },
    { label: "Registered Client", icon: <HowToReg /> },
  ];

  return (
    <CommonModal width="800px" {...otherProps} closeTopRight>
      <Box className="approvalHistoryModal">
        <Typography className="approvalHistoryModal__title">
          Approval History
        </Typography>
        <Box className="approvalHistoryModal__content">
          <Box className="approvalHistoryModal__content__headStepper">
            <Stepper alternativeLabel>
              {steps.map((item, index) => (
                <Step key={item.label} activeStep={0}>
                  <StepLabel
                  // StepIconComponent={() => item.icon}
                  >
                    {item.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box className="approvalHistoryModal__content__body">
            <Stepper orientation="vertical">
              {steps.map((item, index) => (
                <Step key={item.label} activeStep={0}>
                  <StepLabel sx={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "-170px" }}>
                      November 17 11:47
                    </span>
                    {item.label}
                  </StepLabel>
                  <StepContent>Pangit yung store owner</StepContent>
                </Step>
              ))}

              {steps.map((item, index) => (
                <Step key={item.label} activeStep={0}>
                  <StepLabel sx={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "-170px" }}>
                      November 17 11:47
                    </span>
                    {item.label}
                  </StepLabel>
                  <StepContent>Pangit yung store owner</StepContent>
                </Step>
              ))}

              {steps.map((item, index) => (
                <Step key={item.label} activeStep={0}>
                  <StepLabel sx={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "-170px" }}>
                      November 17 11:47
                    </span>
                    {item.label}
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

export default ApprovalHistoryModal;
