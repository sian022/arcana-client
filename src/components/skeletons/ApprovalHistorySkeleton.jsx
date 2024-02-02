import { Close } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";

function ApprovalHistorySkeleton() {
  return (
    <Box className="approvalHistoryModal__content">
      <Box className="approvalHistoryModal__content__headStepper">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton variant="circular" width="27px" height="27px" />

          <Divider orientation="horizontal" sx={{ width: "120px" }} />

          <Skeleton variant="circular" width="27px" height="27px" />

          <Divider orientation="horizontal" sx={{ width: "120px" }} />

          <Skeleton variant="circular" width="27px" height="27px" />
        </Box>
      </Box>

      <Box className="approvalHistoryModal__content__bodySkeleton">
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
      </Box>
    </Box>
  );
}

export default ApprovalHistorySkeleton;
