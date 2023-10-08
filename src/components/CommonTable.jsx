import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";
import { transformKey } from "../utils/CustomFunctions";

function CommonTable({ mapData }) {
  const mapDataKeys = Object.keys(mapData[0]);
  const tableHeads = mapDataKeys.map((key) => transformKey(key));
  return (
    <Box className="tableSuperContainer">
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
      >
        <Table>
          <TableHead>
            <TableRow>
              {tableHeads.map((item, i) => (
                <TableCell key={i}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mapData.map((item, j) => {
              return (
                <TableRow>
                  {mapDataKeys.map((keys) => (
                    <TableCell>{item[keys]}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPage={10}
        count={2}
        onPageChange={() => {
          1 + 1;
        }}
        page={0}
        className="tableSuperContainer__tablePagination"
      />
    </Box>
  );
}

export default CommonTable;
