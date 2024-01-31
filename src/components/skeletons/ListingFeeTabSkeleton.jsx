import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

function ListingFeeTabSkeleton() {
  return (
    <Box className="viewRegistrationModal__listingFee__content">
      <Box className="viewRegistrationModal__listingFee__content__titleGroup">
        <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
          Listing Fee
        </Typography>
      </Box>

      <Box className="viewListingFeeModal__table">
        <TableContainer
          sx={{
            maxHeight: "280px",
            overflow: "auto",
            // width: "620px",
            // width: "700px",
            width: "720px",
            // maxWidth: "700px",
            borderRadius: "10px",
          }}
        >
          <Table>
            <TableHead
              sx={{
                bgcolor: "white !important",
              }}
            >
              <TableRow>
                <TableCell>
                  <Skeleton width="60px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="200px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="40px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="40px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="40px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="40px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="40px" sx={{ transform: "none" }} />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: 4 }).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width="60px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="200px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="40px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="40px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="40px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="40px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="40px" sx={{ transform: "none" }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            position: "absolute",
            right: "50px",
            bottom: "90px",
            gap: "20px",
          }}
        >
          <Skeleton width="120px" sx={{ transform: "none" }} />

          <Skeleton width="80px" sx={{ transform: "none" }} />
        </Box>
      </Box>
    </Box>
  );
}

export default ListingFeeTabSkeleton;
