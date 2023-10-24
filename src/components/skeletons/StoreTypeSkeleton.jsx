import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { Storefront } from "@mui/icons-material";

function StoreTypeSkeleton() {
  return (
    <Box sx={{ display: "flex", my: "20px", mx: "30px", gap: "10px" }}>
      <Skeleton
        width="350px"
        height="480px"
        variant="rounded"
        sx={{ borderRadius: "30px" }}
      />

      <Box
        sx={{
          flex: "1",
          height: "500px",
          margin: "auto",
          borderRadius: "20px",
          display: "flex",
          gap: "20px",
          maxWidth: "900px",
          flexWrap: "wrap",
          justifyContent: "center",
          // alignItems: "center",
          overflow: "auto",
        }}
      >
        {Array(9)
          .fill(null)
          .map((item, index) => (
            <Skeleton
              key={index}
              width="150px"
              height="150px"
              variant="rounded"
              sx={{ borderRadius: "30px" }}
            />
          ))}
      </Box>
    </Box>
  );
}

export default StoreTypeSkeleton;
