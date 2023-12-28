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
import { formatOrdinalPrefix } from "../../utils/CustomFunctions";
import { useGetApproversPerModuleQuery } from "../../features/user-management/api/approverApi";

function ApprovalHistoryModal({ variant = "registration", ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { data: approverData, isFetching: isApproverFetching } =
    useGetApproversPerModuleQuery();

  // const steps = [
  //   { label: "Requested", icon: <EventNote /> },
  //   // { label: "1st Approval", icon: <Check /> },
  //   // { label: "2nd Approval", icon: <CheckCircle /> },
  //   // { label: "Regular Client", icon: <HowToReg /> },
  // ];

  // const approverSteps = approverData?.registration?.map((approver) => ({
  //   label: approver,
  //   icon: <Check />,
  // }));

  // steps?.push(approverSteps);

  const steps = [
    { label: "Requested", icon: <EventNote /> },
    { label: "1st Approval", icon: <Check /> },
    // { label: "2nd Approval", icon: <CheckCircle /> },
    // { label: "Regular Client", icon: <HowToReg /> },
  ];

  const handleActiveStep = (recentData) => {
    if (recentData?.length === 0 || !recentData) {
      return 1;
    } else if (recentData?.level === 1 && recentData?.status === "Rejected") {
      return null;
    } else if (recentData?.level === 1 && recentData?.status === "Approved") {
      return 2;
    } else if (recentData?.level === 2 && recentData?.status === "Rejected") {
      return null;
    } else if (recentData?.level === 2 && recentData?.status === "Approved") {
      return 3;
    } else if (!!recentData?.updatedAt) {
      return 1;
    } else {
      return 3;
    }

    // if (recentLevel === 0) {
    //   return 1;
    // } else if (recentLevel === 1 && recentStatus === "Rejected") {
    //   return null;
    // } else if (recentLevel === 1 && recentStatus === "Approved") {
    //   return 0;
    // } else if (recentLevel === 2 && recentStatus === "Rejected") {
    //   return 2;
    // } else if (recentLevel === 2 && recentStatus === "Approved") {
    //   return 3;
    // } else {
    //   return 4;
    // }
  };

  const combinedHistories = [
    ...(selectedRowData?.clientApprovalHistories || []),
    ...(selectedRowData?.updateHistories || []),
  ];

  const combinedListingFeeHistories = [
    ...(selectedRowData?.listingFeeApprovalHistories || []),
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
              activeStep={handleActiveStep(
                // combinedHistories?.[0]?.level,
                // combinedHistories?.[0]?.status,
                combinedHistories?.[0]
              )}
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
              {steps.map((item, index) => (
                <Step key={item.label}>
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
                    {item.label}
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
                        ).format("MMMM D HH:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {!history?.status
                          ? "Requested"
                          : `${history?.status} - ${formatOrdinalPrefix(
                              history?.level
                            )} Approval`}
                      </span>
                    </StepLabel>

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
              {/* {variant === "registration" &&
                selectedRowData?.clientApprovalHistories?.map(
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

                        <span
                          style={{
                            fontWeight: "700",
                            textTransform: "uppercase",
                          }}
                        >
                          {approval?.status} -{" "}
                          {formatOrdinalPrefix(approval?.level)} Approval
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
                          <Typography fontSize="14px">
                            Remarks:{" "}
                            <span style={{ fontWeight: "500" }}>
                              {approval?.reason}
                            </span>
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  )
                )}

              {variant === "registration" &&
                selectedRowData?.updateHistories?.map((update, index) => (
                  <Step key={index} active expanded>
                    <StepLabel sx={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "-170px",
                          fontWeight: "600",
                        }}
                      >
                        {moment(update?.updatedAt).format("MMMM D HH:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        Requested
                      </span>
                    </StepLabel>
                  </Step>
                ))} */}

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
                        ).format("MMMM D HH:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {!history?.status
                          ? "Requested"
                          : `${history?.status} - ${formatOrdinalPrefix(
                              history?.level
                            )} Approval`}
                      </span>
                    </StepLabel>

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
              {/* {variant === "listingFee" &&
                selectedRowData?.listingFeeApprovalHistories?.map(
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
                          {approval?.status} -{" "}
                          {formatOrdinalPrefix(approval?.level)} Approval
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
                          <Typography fontSize="14px">
                            Remarks:{" "}
                            <span style={{ fontWeight: "500" }}>
                              {approval?.reason}
                            </span>
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  )
                )}
              {variant === "listingFee" &&
                selectedRowData?.updateHistories?.map((update, index) => (
                  <Step key={index} active expanded>
                    <StepLabel sx={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "-170px",
                          fontWeight: "600",
                        }}
                      >
                        {moment(update?.updatedAt).format("MMMM D HH:mm a")}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        Requested
                      </span>
                    </StepLabel>
                  </Step>
                ))} */}

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
                    {moment(selectedRowData?.createdAt).format(
                      "MMMM D HH:mm a"
                    )}
                  </span>

                  <span
                    style={{
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    Requested
                  </span>
                </StepLabel>
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
