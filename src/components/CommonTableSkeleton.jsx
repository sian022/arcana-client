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

function CommonTableSkeleton({
  columnCount,
  evenLesserCompact,
  lesserCompact,
  lessCompact,
  lowerCompact,
  compact,
  expanded,
  mt,
}) {
  return (
    <Box className="tableSuperContainer" sx={{ mt: mt && mt }}>
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
        sx={{
          height: expanded
            ? "calc(100vh - 220px)"
            : evenLesserCompact
            ? "calc(100vh - 262px)"
            : lesserCompact
            ? "calc(100vh - 282px)"
            : lessCompact
            ? "calc(100vh - 290px)"
            : lowerCompact
            ? "calc(100vh - 310px)"
            : compact
            ? "calc(100vh - 330px)"
            : null,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: columnCount ?? 5 }, (_, index) => (
                <TableCell key={index}>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 8 }, (row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount ?? 5 }, (cell, cellIndex) => (
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
