import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { Storefront } from "@mui/icons-material";

function StoreTypeSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "2rem",
          color: "secondary.main",
          mx: "30px",
        }}
      >
        Prospect
      </Typography>
      <Box sx={{ display: "flex", my: "20px", mx: "30px", gap: "10px" }}>
        <Button
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "30px",
            backgroundColor: "secondary.main",
            color: "white !important",
            " &:hover": {
              bgcolor: "accent.main",
            },
          }}
        >
          <Storefront sx={{ fontSize: "400px" }} />
          <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
            Main
          </Typography>
        </Button>
        <Skeleton height="400px" />

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
          {data?.storeTypes?.map((item) => (
            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "30px",
                backgroundColor: "secondary.main",
                color: "white !important",
                " &:hover": {
                  bgcolor: "accent.main",
                },
              }}
            >
              <Storefront sx={{ fontSize: "150px" }} />
              <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                {item.storeTypeName}
              </Typography>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default StoreTypeSkeleton;
