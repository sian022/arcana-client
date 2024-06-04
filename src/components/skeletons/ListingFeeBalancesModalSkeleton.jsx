import { Box, Skeleton } from "@mui/material";

const ListingFeeBalancesModalSkeleton = () => {
  return (
    <>
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

      <Box
        className="listingFeeBalancesModal__pagination"
        sx={{ gap: "5px", alignItems: "center" }}
      >
        <Skeleton variant="circular" width="30px" height="30px" />
        <Skeleton variant="circular" width="35px" height="35px" />
        <Skeleton variant="circular" width="30px" height="30px" />
      </Box>
    </>
  );
};

export default ListingFeeBalancesModalSkeleton;
