import {
  Box,
  Skeleton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";

function PaymentHistoriesSkeleton() {
  return (
    <Box className="paymentHistoriesModal__body" sx={{ overflow: "hidden" }}>
      <Stepper
        orientation="vertical"
        sx={{
          "& .MuiStepConnector-root": {
            flex: "none",
            WebkitFlex: "none",
          },
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Step key={`ph-skeleton-${index}`} active expanded>
            <StepLabel StepIconProps={{ icon: "" }}>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Skeleton width="100px" />

                <Skeleton width="60px" />
              </Box>
            </StepLabel>

            <StepContent>
              <Box className="paymentHistoriesModal__body__stepContent">
                <Box className="paymentHistoriesModal__body__stepContent__total">
                  <Skeleton width="70px" />

                  <Skeleton width="90px" />
                </Box>

                <Box className="paymentHistoriesModal__body__stepContent__paymentTypes">
                  <Skeleton width="90px" />

                  <Box className="paymentHistoriesModal__body__stepContent__paymentTypes__chips">
                    <Skeleton width="40px" />
                    <Skeleton width="70px" />
                    <Skeleton width="60px" />
                  </Box>

                  <Skeleton variant="circular" />
                </Box>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default PaymentHistoriesSkeleton;
