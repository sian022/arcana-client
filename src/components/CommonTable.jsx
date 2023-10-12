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
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";

function CommonTable({
  mapData,
  excludeKeys,
  tableHeads,
  editable,
  archivable,
  onEdit,
  onArchive,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  count,
}) {
  if (!mapData || mapData.length === 0) {
    // Return some message or UI element indicating that there is no data.
    return <div>No data available.</div>;
  }

  var dataToMap = mapData;
  var tableHeadsList;

  if (excludeKeys) {
    const filteredData = mapData?.map((obj) => {
      const filteredObj = Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => !excludeKeys.includes(key))
      );
      return filteredObj;
    });
    dataToMap = filteredData;
  }

  const dataToMapKeys = Object.keys(dataToMap[0]);
  if (tableHeads) {
    tableHeadsList = tableHeads;
  } else {
    tableHeadsList = dataToMapKeys
      .filter((key) => key !== "id")
      .map((key) => transformKey(key));
  }

  if (editable || archivable) {
    tableHeadsList.push("Actions");
  }

  return (
    <Box className="tableSuperContainer">
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
      >
        <Table>
          <TableHead>
            <TableRow>
              {tableHeadsList.map((item, i) => (
                <TableCell key={i}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataToMap.map((item, j) => {
              return (
                <TableRow>
                  {dataToMapKeys.map((keys) => {
                    if (keys === "id") {
                      return null;
                    }
                    return <TableCell>{item[keys]}</TableCell>;
                  })}
                  {(editable || archivable) && (
                    <TableCell>
                      {editable && (
                        <SecondaryButton
                          onClick={() => {
                            onEdit(item);
                          }}
                        >
                          Edit
                        </SecondaryButton>
                      )}
                      {archivable && (
                        <DangerButton
                          sx={{ marginLeft: "10px" }}
                          onClick={() => {
                            onArchive(item.id);
                          }}
                        >
                          Archive
                        </DangerButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: 2000 }]}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(e.target.value);
        }}
        page={page}
        onPageChange={(_, newPage) => {
          setPage(newPage);
        }}
        count={count}
        className="tableSuperContainer__tablePagination"
      />
    </Box>
  );
}

export default CommonTable;
