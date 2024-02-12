import { Close } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";

function ApprovalHistorySkeleton() {
  return (
    <Box className="approvalHistoryModal__content">
      <Box className="approvalHistoryModal__content__headStepper">
        <Stepper alternativeLabel>
          {Array.from({ length: 3 }).map((item, index) => (
            <Step key={index}>
              <StepLabel StepIconProps={{ style: { color: "#f1f1f1" } }}>
                <Skeleton
                  width="80px"
                  sx={{ margin: "auto", transform: "none" }}
                />
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box className="approvalHistoryModal__content__body">
        <Stepper orientation="vertical">
          {Array.from({ length: 3 }).map((history, index) => (
            <Step key={index} active expanded>
              <StepLabel
                StepIconComponent=""
                StepIconProps={{ style: { color: "#f1f1f1" } }}
                sx={{ position: "relative" }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: "-170px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    width="70px"
                    sx={{ transform: "none", marginRight: "5px" }}
                  />

                  <Skeleton width="60px" sx={{ transform: "none" }} />
                </Box>

                <Skeleton width="120px" sx={{ transform: "none" }} />
              </StepLabel>

              <StepContent>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
                >
                  <Box
                    sx={{ display: "flex", gap: "5px", alignItems: "center" }}
                  >
                    <Skeleton width="50px" sx={{ transform: "none" }} />
                    <Skeleton width="150px" sx={{ transform: "none" }} />
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: "5px", alignItems: "center" }}
                  >
                    <Skeleton width="50px" sx={{ transform: "none" }} />
                    <Skeleton width="150px" sx={{ transform: "none" }} />
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* <Box className="approvalHistoryModal__content__bodySkeleton">
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {Array.from({ length: 3 }).map((history, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: "20px", alignItems: "center" }}
            >
              <Skeleton width="100px" sx={{ transform: "none" }} />

              <Skeleton variant="circular" width="25px" height="25px" />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  position: "relative",
                  top: "12px",
                }}
              >
                <Skeleton width="200px" sx={{ transform: "none" }} />
                <Skeleton width="200px" sx={{ transform: "none" }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box> */}
    </Box>
  );
}

export default ApprovalHistorySkeleton;
