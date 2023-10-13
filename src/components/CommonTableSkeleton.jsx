import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";

function CommonTableSkeleton() {
  return (
    <Box className="tableSuperContainer">
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
      >
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: 5 }, () => (
                <TableCell>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }, () => (
              <TableRow>
                {Array.from({ length: 5 }, () => (
                  <TableCell>
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
