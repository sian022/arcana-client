import React, { useRef } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  IconButton,
  Step,
  StepButton,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import {
  Cancel,
  Check,
  CheckCircle,
  Circle,
  Close,
  EventNote,
  HowToReg,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import moment from "moment";

function ApprovalHistoryModal({ ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const steps = [
    { label: "Requested", icon: <EventNote /> },
    { label: "1st Approval", icon: <Check /> },
    { label: "2nd Approval", icon: <CheckCircle /> },
    { label: "Registered Client", icon: <HowToReg /> },
  ];

  return (
    <CommonModal width="650px" {...otherProps}>
      <Box className="approvalHistoryModal">
        <Typography className="approvalHistoryModal__title">
          Approval History
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: "20px",
            top: "20px",
          }}
        >
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
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
              {selectedRowData?.clientApprovalHistories?.map(
                (approval, index) => (
                  <Step key={index} active expanded>
                    <StepLabel
                      StepIconComponent={() =>
                        approval?.status === "Rejected" ? (
                          <Cancel sx={{ color: "error.main" }} />
                        ) : approval?.status === "Approved" ? (
                          <CheckCircle sx={{ color: "success.main" }} />
                        ) : (
                          <Circle sx={{ color: "gray" }} />
                        )
                      }
                      sx={{ position: "relative" }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-170px",
                          fontWeight: "600",
                        }}
                      >
                        {moment(approval?.createdAt).format("MMMM D HH:mm a")}
                      </span>
                      <span style={{ fontWeight: "600" }}>
                        {approval?.status}
                      </span>
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Name:{" "}
                        <span style={{ fontWeight: "500" }}>
                          {approval?.approver}
                        </span>
                      </Typography>
                      {approval?.reason && (
                        <Typography>Remarks: {approval?.reason}</Typography>
                      )}
                    </StepContent>
                  </Step>
                )
              )}
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
