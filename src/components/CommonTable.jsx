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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { transformKey } from "../utils/CustomFunctions";
import CommonActions from "./CommonActions";
import NoData from "../assets/images/no-data.jpg";
import { useDispatch } from "react-redux";
import { setSelectedRow } from "../features/misc/reducers/selectedRowSlice";
import CommonTableSkeleton from "./CommonTableSkeleton";

function CommonTable({
  mapData,
  excludeKeys,
  excludeKeysDisplay,
  tableHeads,
  editable,
  archivable,
  onEdit,
  onArchive,
  onView,
  onFreebie,
  onReleaseFreebie,
  onRegularRegister,
  onUpdateFreebies,
  onCancelFreebies,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  count = 0,
  status,
  compact,
  moreCompact,
  percentageArray,
  pesoArray,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = NoData;

    image.onload = () => {
      setImageLoaded(true);
    };
  }, [mapData]);

  if (!mapData || mapData.length === 0) {
    return (
      <Box className="noData">
        {imageLoaded && (
          <>
            <img src={NoData} alt="no-data-img" className="noData__image" />
            <Typography>No data found</Typography>
          </>
        )}
      </Box>
    );
  }

  const dispatch = useDispatch();

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
      .filter(
        (key) =>
          // key !== "id"
          !excludeKeysDisplay?.includes(key)
      )
      .map((key) => transformKey(key));
  }

  if ((editable || archivable) && !tableHeadsList.includes("Actions")) {
    tableHeadsList.push("Actions");
  }

  return (
    <Box className="tableSuperContainer">
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
        sx={{
          height: compact
            ? "calc(100vh - 370px)"
            : moreCompact
            ? "calc(100vh - 400px)"
            : null,
        }}
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
                <TableRow
                  key={j}
                  onClick={() => {
                    dispatch(setSelectedRow(item));
                  }}
                >
                  {dataToMapKeys.map((keys, k) => {
                    if (
                      // keys === "id"
                      excludeKeysDisplay?.includes(keys)
                    ) {
                      return null;
                    }
                    return (
                      <TableCell key={k}>
                        {pesoArray && pesoArray.includes(keys) && "₱ "}

                        {item[keys]}

                        {percentageArray &&
                          percentageArray.includes(keys) &&
                          "%"}
                      </TableCell>
                    );
                  })}
                  {(editable || archivable) && (
                    <TableCell>
                      <CommonActions
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onFreebie={onFreebie && onFreebie}
                        onReleaseFreebie={onReleaseFreebie && onReleaseFreebie}
                        onRegularRegister={
                          onRegularRegister && onRegularRegister
                        }
                        onUpdateFreebies={onUpdateFreebies && onUpdateFreebies}
                        onCancelFreebies={onCancelFreebies && onCancelFreebies}
                        onView={onView && onView}
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
