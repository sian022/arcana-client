import { Box, Skeleton, Typography } from "@mui/material";

const AdvancePaymentBalancesModalSkeleton = () => {
  return (
    <Box className="advancePaymentBalancesModal">
      <Typography className="advancePaymentBalancesModal__title">
        Advance Payment Balances
      </Typography>

      <Box className="advancePaymentBalancesModal__filters">
        <Skeleton height="35px" width="100%" sx={{ transform: "none" }} />
      </Box>

      <Box className="advancePaymentBalancesModal__list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} className="advancePaymentBalancesModal__list__item">
            <Box className="advancePaymentBalancesModal__list__item__clientInfo">
              <Skeleton width="160px" height="40px" />

              <Skeleton width="200px" />
            </Box>

            <Skeleton sx={{ transform: "none" }} height="30px" width="140px" />
          </Box>
        ))}
      </Box>

      <Box className="advancePaymentBalancesModal__pagination">
        <Skeleton sx={{ transform: "none" }} />
      </Box>
    </Box>
  );
};

export default AdvancePaymentBalancesModalSkeleton;
