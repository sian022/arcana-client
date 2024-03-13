import { Box, Skeleton } from "@mui/material";

function RegisterClientFormSkeleton() {
  return (
    <>
      <Box className="register">
        <Box className="register__firstRow">
          <Box className="register__firstRow__customerInformation">
            <Skeleton width="200px" height="25px" sx={{ transform: "none" }} />

            <Box className="register__firstRow__customerInformation__row">
              <Skeleton height="40px" sx={{ transform: "none" }} />

              <Skeleton height="40px" sx={{ transform: "none" }} />
            </Box>
            <Box className="register__firstRow__customerInformation__row">
              <Skeleton height="40px" sx={{ transform: "none" }} />

              <Skeleton height="40px" sx={{ transform: "none" }} />
            </Box>
          </Box>
          <Box className="register__firstRow__tinNumber">
            <Skeleton width="200px" height="25px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />
          </Box>
        </Box>
        <Box className="register__secondRow">
          <Box className="register__secondRow">
            <Skeleton width="200px" height="25px" sx={{ transform: "none" }} />

            <Box className="register__secondRow">
              <Box className="register__secondRow__content">
                <Skeleton height="40px" sx={{ transform: "none" }} />

                <Skeleton height="40px" sx={{ transform: "none" }} />

                <Skeleton height="40px" sx={{ transform: "none" }} />
              </Box>

              <Box className="register__secondRow__content">
                <Skeleton height="40px" sx={{ transform: "none" }} />

                <Skeleton height="40px" sx={{ transform: "none" }} />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="register__thirdRow">
          <Box className="register__thirdRow__column">
            <Skeleton height="25px" width="200px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />
          </Box>

          <Box className="register__thirdRow__column">
            <Skeleton height="25px" width="200px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />
          </Box>

          <Box className="register__thirdRow__column">
            <Skeleton height="25px" width="200px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />
          </Box>
        </Box>
        <Box className="register__secondRow">
          <Box className="register__titleBox">
            <Skeleton width="200px" height="25px" sx={{ transform: "none" }} />

            <Skeleton width="25px" sx={{ transform: "none" }} />

            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Box>

          <Box className="register__secondRow__content">
            <Skeleton height="40px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />
          </Box>

          <Box className="register__secondRow__content">
            <Skeleton height="40px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />

            <Skeleton height="40px" sx={{ transform: "none" }} />
          </Box>
        </Box>

        <Box className="register__secondRow">
          <Box className="register__titleBox">
            <Skeleton width="250px" height="25px" sx={{ transform: "none" }} />

            <Skeleton width="25px" sx={{ transform: "none" }} />

            <Skeleton width="300px" sx={{ transform: "none" }} />
          </Box>
          <Box className="register__secondRow">
            <Box className="register__secondRow__content">
              <Skeleton height="40px" sx={{ transform: "none" }} />

              <Skeleton height="40px" sx={{ transform: "none" }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="commonDrawer__actionsNoMarginBottom">
        <Skeleton height="25px" width="60px" sx={{ transform: "none" }} />
      </Box>
    </>
  );
}

export default RegisterClientFormSkeleton;
