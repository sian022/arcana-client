import { Box, Skeleton } from "@mui/material";

function DashboardSkeleton() {
  return (
    <Box className="dashboard">
      <Box className="dashboard__top">
        <Skeleton sx={{ transform: "none" }} />

        <Skeleton sx={{ transform: "none" }} />

        <Skeleton sx={{ transform: "none" }} />

        <Skeleton sx={{ transform: "none" }} />
      </Box>

      <Box className="dashboard__body">
        <Box className="dashboard__body__left">
          <Skeleton sx={{ transform: "none", flex: 1 }} />

          <Box className="dashboard__body__left__quickLinks">
            <Skeleton sx={{ transform: "none" }} />

            <Skeleton sx={{ transform: "none" }} />

            <Skeleton sx={{ transform: "none" }} />
          </Box>
        </Box>

        <Skeleton sx={{ transform: "none" }} />
      </Box>
    </Box>
  );
}

export default DashboardSkeleton;
