import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { transformKey } from "../utils/CustomFunctions";
import useDisclosure from "../hooks/useDisclosure";
import CommonActions from "./CommonActions";
import NoData from "../assets/images/no-data.jpg";

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
  status,
}) {
  if (!mapData || mapData.length === 0) {
    // Return some message or UI element indicating that there is no data.
    return (
      <Box className="noData">
        <img src={NoData} alt="no-data-img" className="noData__image" />
        <Typography>No data found</Typography>
      </Box>
    );
  }

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

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
                    // <TableCell>
                    //   {editable && (
                    //     <SecondaryButton
                    //       onClick={() => {
                    //         onEdit(item);
                    //       }}
                    //     >
                    //       Edit
                    //     </SecondaryButton>
                    //   )}
                    //   {archivable && (
                    //     <DangerButton
                    //       sx={{ marginLeft: "10px" }}
                    //       onClick={() => {
                    //         onArchive(item.id);
                    //       }}
                    //     >
                    //       Archive
                    //     </DangerButton>
                    //   )}
                    // </TableCell>
                    <TableCell>
                      <CommonActions
                        onEdit={onEdit}
                        onArchive={onArchive}
                        item={item}
                        status={status}
                      />
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
