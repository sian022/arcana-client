import { Box, Skeleton, Typography } from "@mui/material";

const ListingFeeBalancesModalSkeleton = () => {
  return (
    <Box className="listingFeeBalancesModal">
      <Typography className="listingFeeBalancesModal__title">
        Listing Fee Balances
      </Typography>

      <Box className="listingFeeBalancesModal__filters">
        <Skeleton height="35px" width="100%" sx={{ transform: "none" }} />
      </Box>

      <Box className="listingFeeBalancesModal__list">
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} className="listingFeeBalancesModal__list__item">
            <Box className="listingFeeBalancesModal__list__item__clientInfo">
              <Skeleton width="160px" height="40px" />

              <Skeleton width="200px" />
            </Box>

            <Skeleton sx={{ transform: "none" }} height="30px" width="140px" />
          </Box>
        ))}
      </Box>

      <Box className="listingFeeBalancesModal__pagination">
        <Skeleton sx={{ transform: "none" }} />
      </Box>
    </Box>
  );
};

export default ListingFeeBalancesModalSkeleton;
