import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

function CommonTableSkeleton({ compact, moreCompact, mt }) {
  return (
    <Box className="tableSuperContainer" sx={{ mt: mt && mt }}>
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
        sx={{
          height: compact
            ? // ? "calc(100vh - 370px)"
              "calc(100vh - 330px)"
            : moreCompact
            ? // ? "calc(100vh - 400px)"
              "calc(100vh - 330px)"
            : null,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: 5 }, (_, index) => (
                <TableCell key={index}>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }, (row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 5 }, (cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        component="div"
        className="tableSuperContainer__tablePagination commonTableSkeletonFooter"
      >
        <Box>
          <Skeleton sx={{ width: "120px" }} />
        </Box>
        <Box>
          <Skeleton sx={{ width: "30px" }} />
        </Box>
        <Box>
          <Skeleton sx={{ width: "70px" }} />
        </Box>
        <Box>
          <Skeleton sx={{ width: "50px", marginRight: "20px" }} />
        </Box>
      </Box>
    </Box>
  );
}

export default CommonTableSkeleton;
