import React, { useEffect, useRef, useState } from "react";
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
import { formatOrdinalPrefix } from "../../utils/CustomFunctions";

function ApprovalHistoryModal({ variant = "registration", ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;
  // const [steps, setSteps] = useState([
  //   { label: "REQUESTED", icon: <EventNote /> },
  // ]);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const combinedHistories = [
    ...(selectedRowData?.clientApprovalHistories || []),
    ...(selectedRowData?.updateHistories || []),
  ];

  const combinedListingFeeHistories = [
    ...(selectedRowData?.listingFeeApprovalHistories || []),
    ...(selectedRowData?.updateHistories || []),
  ];

  const combinedOtherExpensesHistories = [
    ...(selectedRowData?.approvalHistories || []),
    ...(selectedRowData?.updateHistories || []),
  ];

  combinedHistories.sort(
    (a, b) =>
      new Date(b.createdAt || b.updatedAt) -
      new Date(a.createdAt || a.updatedAt)
    // (a, b) =>
    //   new Date(a.createdAt || a.updatedAt) -
    //   new Date(b.createdAt || b.updatedAt)
  );

  combinedListingFeeHistories.sort(
    (a, b) =>
      new Date(b.createdAt || b.updatedAt) -
      new Date(a.createdAt || a.updatedAt)
    // (a, b) =>
    //   new Date(a.createdAt || a.updatedAt) -
    //   new Date(b.createdAt || b.updatedAt)
  );

  combinedOtherExpensesHistories.sort(
    (a, b) =>
      new Date(b.createdAt || b.updatedAt) -
      new Date(a.createdAt || a.updatedAt)
    // (a, b) =>
    //   new Date(a.createdAt || a.updatedAt) -
    //   new Date(b.createdAt || b.updatedAt)
  );

  const handleActiveStep = (recentData) => {
    const level = recentData?.level || 1;
    const status = recentData?.status;
    const updatedAtExists = !!recentData?.updatedAt;
    const approverCount = (selectedRowData?.approvers?.length || 0) + 1;

    if (status === "Rejected") return null;

    if (updatedAtExists) {
      return 1;
    } else if (level && status === "Approved") {
      return level + 1;
    } else {
      return approverCount;
    }
  };

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
            <Stepper
              alternativeLabel
              activeStep={
                variant === "registration"
                  ? handleActiveStep(combinedHistories?.[0])
                  : variant === "listingFee"
                  ? handleActiveStep(combinedListingFeeHistories?.[0])
                  : variant === "otherExpenses"
                  ? handleActiveStep(combinedOtherExpensesHistories?.[0])
                  : null
              }
              // activeStep={
              //   variant === "registration" &&
              //   selectedRowData?.clientApprovalHistories?.length === 0
              //     ? 1
              //     : variant === "listingFee" &&
              //       selectedRowData?.listingFeeApprovalHistories?.length === 0
              //     ? 1
              //     : handleActiveStep(
              //         selectedRowData?.clientApprovalHistories?.[0]?.level,
              //         selectedRowData?.clientApprovalHistories?.[0]?.status
              //       )
              // }
            >
              <Step>
                <StepLabel>REQUESTED</StepLabel>
              </Step>

              {selectedRowData?.approvers?.map((item, index) => (
                <Step key={index}>
                  <StepLabel
                  // StepIconComponent={() => (
                  //   <Cancel
                  //     sx={{
                  //       color: "error.main",
                  //       // width: "1.7rem",
                  //       // height: "1.7rem",
                  //     }}
                  //   />
                  // )}
                  // StepIconComponent={() => item.icon}
                  >
                    {item.name}
                    {/* {formatOrdinalPrefix(item.level)} Approval */}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box className="approvalHistoryModal__content__body">
            <Stepper orientation="vertical">
              {variant === "registration" &&
                combinedHistories.map((history, index) => (
                  <Step key={index} active expanded>
                    <StepLabel
                      StepIconComponent={() =>
                        history?.status === "Rejected" ? (
                          <Cancel sx={{ color: "error.main" }} />
                        ) : history?.status === "Approved" ? (
                          <CheckCircle sx={{ color: "success.main" }} />
                        ) : (
                          // <Circle sx={{ color: "gray" }} />
                          <Circle sx={{ color: "primary.main" }} />
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
                        {moment(
                          history?.createdAt || history?.updatedAt
                        ).format("MMMM D H:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {!history?.status
                          ? "REQUESTED"
                          : `${history?.status} - ${formatOrdinalPrefix(
                              history?.level
                            )} Approval`}
                      </span>
                    </StepLabel>

                    {!history?.status && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {selectedRowData?.requestedBy}
                          </span>
                        </Typography>
                        {history?.reason && (
                          <Typography fontSize="14px">
                            Remarks:{" "}
                            <span style={{ fontWeight: "500" }}>
                              {history?.reason}
                            </span>
                          </Typography>
                        )}
                      </StepContent>
                    )}

                    {!history?.status && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {selectedRowData?.requestedBy}
                          </span>
                        </Typography>
                      </StepContent>
                    )}

                    {!!history?.createdAt && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {history?.approver}
                          </span>
                        </Typography>
                        {history?.reason && (
                          <Typography fontSize="14px">
                            Remarks:{" "}
                            <span style={{ fontWeight: "500" }}>
                              {history?.reason}
                            </span>
                          </Typography>
                        )}
                      </StepContent>
                    )}
                  </Step>
                ))}

              {variant === "listingFee" &&
                combinedListingFeeHistories.map((history, index) => (
                  <Step key={index} active expanded>
                    <StepLabel
                      StepIconComponent={() =>
                        history?.status === "Rejected" ? (
                          <Cancel sx={{ color: "error.main" }} />
                        ) : history?.status === "Approved" ? (
                          <CheckCircle sx={{ color: "success.main" }} />
                        ) : (
                          // <Circle sx={{ color: "gray" }} />
                          <Circle sx={{ color: "primary.main" }} />
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
                        {moment(
                          history?.createdAt || history?.updatedAt
                        ).format("MMMM D H:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {!history?.status
                          ? "REQUESTED"
                          : `${history?.status} - ${formatOrdinalPrefix(
                              history?.level
                            )} Approval`}
                      </span>
                    </StepLabel>

                    {!history?.status && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {selectedRowData?.requestedBy}
                          </span>
                        </Typography>
                      </StepContent>
                    )}

                    {!!history?.createdAt && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {history?.approver}
                          </span>
                        </Typography>
                        {history?.reason && (
                          <Typography fontSize="14px">
                            Remarks:{" "}
                            <span style={{ fontWeight: "500" }}>
                              {history?.reason}
                            </span>
                          </Typography>
                        )}
                      </StepContent>
                    )}
                  </Step>
                ))}

              {variant === "otherExpenses" &&
                combinedOtherExpensesHistories.map((history, index) => (
                  <Step key={index} active expanded>
                    <StepLabel
                      StepIconComponent={() =>
                        history?.status === "Rejected" ? (
                          <Cancel sx={{ color: "error.main" }} />
                        ) : history?.status === "Approved" ? (
                          <CheckCircle sx={{ color: "success.main" }} />
                        ) : (
                          // <Circle sx={{ color: "gray" }} />
                          <Circle sx={{ color: "primary.main" }} />
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
                        {moment(
                          history?.createdAt || history?.updatedAt
                        ).format("MMMM D H:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {!history?.status
                          ? "REQUESTED"
                          : `${history?.status} - ${formatOrdinalPrefix(
                              history?.level
                            )} Approval`}
                      </span>
                    </StepLabel>

                    {!history?.status && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {selectedRowData?.requestedBy}
                          </span>
                        </Typography>
                      </StepContent>
                    )}

                    {!!history?.createdAt && (
                      <StepContent>
                        <Typography fontSize="14px">
                          Name:{" "}
                          <span style={{ fontWeight: "500" }}>
                            {history?.approver}
                          </span>
                        </Typography>
                        {history?.reason && (
                          <Typography fontSize="14px">
                            Remarks:{" "}
                            <span style={{ fontWeight: "500" }}>
                              {history?.reason}
                            </span>
                          </Typography>
                        )}
                      </StepContent>
                    )}
                  </Step>
                ))}

              <Step active expanded>
                <StepLabel
                  StepIconComponent={() => (
                    <Circle sx={{ color: "primary.main" }} />
                  )}
                  sx={{ position: "relative" }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-170px",
                      fontWeight: "600",
                    }}
                  >
                    {moment(selectedRowData?.createdAt).format("MMMM D H:mm a")}
                  </span>

                  <span
                    style={{
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    REQUESTED
                  </span>
                </StepLabel>

                <StepContent>
                  <Typography fontSize="14px">
                    Name:{" "}
                    <span style={{ fontWeight: "500" }}>
                      {selectedRowData?.requestedBy}
                    </span>
                  </Typography>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </Box>
      </Box>
      {/* <Box className="approvalHistoryModal__actions">
        <SecondaryButton onClick={onClose}>Confirm</SecondaryButton>
      </Box> */}
    </CommonModal>
  );
}

export default ApprovalHistoryModal;
