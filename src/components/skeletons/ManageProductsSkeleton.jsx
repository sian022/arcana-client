import { Box, Skeleton, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function ManageProductsSkeleton() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <Box className="priceModeManagementModal">
      <Typography fontSize="1.1rem" fontWeight="700">
        Price Mode Info
      </Typography>

      <Box className="priceModeManagementModal__header">
        <TextField
          label="Price Mode"
          size="small"
          readOnly
          value={selectedRowData?.priceModeCode}
          sx={{ width: "140px", pointerEvents: "none" }}
        />

        <TextField
          label="Price Mode Description"
          size="small"
          readOnly
          value={selectedRowData?.priceModeDescription}
          sx={{ width: "400px", pointerEvents: "none" }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Typography fontSize="1.1rem" fontWeight="700">
          Products List
        </Typography>

        <Skeleton />
      </Box>

      <Box className="priceModeManagementModal__items" ref={parent}>
        {Array.from({ length: 10 }).map((item, index) => (
          <Box key={index} className="priceModeManagementModal__items__item">
            <Skeleton />

            <Skeleton />

            <Skeleton />

            <Skeleton />
          </Box>
        ))}
      </Box>

      <Skeleton />
    </Box>
  );
}

export default ManageProductsSkeleton;
