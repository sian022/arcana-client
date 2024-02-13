import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";

function StoreTypeSkeleton() {
  return (
    <Box className="prospectingStoreList">
      <Skeleton
        width="350px"
        height="500px"
        sx={{ borderRadius: "30px", transform: "none" }}
      />

      <Box className="prospectingStoreList__storeTypeButtons">
        {Array(9)
          .fill(null)
          .map((item, index) => (
            <Skeleton
              key={index}
              height="150px"
              sx={{ borderRadius: "30px", transform: "none" }}
            />
          ))}
      </Box>
    </Box>
  );
}

export default StoreTypeSkeleton;
