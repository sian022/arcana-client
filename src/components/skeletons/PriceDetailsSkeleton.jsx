import {
  Box,
  Skeleton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";

function PriceDetailsSkeleton() {
  return (
    <Box className="priceChangeModal__content">
      <Box className="priceChangeModal__content__left">
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Typography className="priceChangeModal__content__left__title">
            Future Prices
          </Typography>

          <Skeleton width="80px" />
        </Box>

        <Box
          className="priceChangeModal__content__left__body"
          sx={{ overflow: "hidden" }}
        >
          <Stepper orientation="vertical">
            {Array.from({ length: 3 }).map((item, index) => (
              <Step expanded>
                <StepLabel
                  sx={{ position: "relative" }}
                  StepIconProps={{ icon: "", style: { color: "#f1f1f1" } }}
                >
                  <Skeleton />
                </StepLabel>
                <StepContent>
                  <Skeleton />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      <Box className="priceChangeModal__content__right">
        <Typography className="priceChangeModal__content__right__title">
          Price History
        </Typography>

        <Box
          className="priceChangeModal__content__right__body"
          sx={{ overflow: "hidden" }}
        >
          <Stepper orientation="vertical">
            {Array.from({ length: 3 }).map((item, index) => (
              <Step active expanded>
                <StepLabel
                  sx={{ position: "relative" }}
                  StepIconProps={{ icon: "", style: { color: "#f1f1f1" } }}
                >
                  <Skeleton />
                </StepLabel>

                <StepContent>
                  <Skeleton />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    </Box>
  );
}

export default PriceDetailsSkeleton;
