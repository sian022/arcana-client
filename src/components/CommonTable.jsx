import {
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeads.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {mapData.map((item, i) => {
            return (
              <TableRow>
                {mapDataKeys.map((keys) => (
                  <TableCell key={keys}>{item[keys]}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination component="div" rowsPerPage={10} />
    </TableContainer>
  );
}

export default CommonTable;
