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

function FreebiesTabSkeleton() {
  return (
    <Box className="viewRegistrationModal__listingFee__content">
      <Box className="viewRegistrationModal__listingFee__content__titleGroup">
        <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
          Freebies
        </Typography>
      </Box>
      <Box className="viewListingFeeModal__table">
        <TableContainer
          sx={{
            maxHeight: "280px",
            overflow: "auto",
            // width: "620px",
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
                  <Skeleton width="70px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="350px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="50px" sx={{ transform: "none" }} />
                </TableCell>
                <TableCell>
                  <Skeleton width="80px" sx={{ transform: "none" }} />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: 4 }).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width="70px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="350px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="50px" sx={{ transform: "none" }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="80px" sx={{ transform: "none" }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default FreebiesTabSkeleton;
