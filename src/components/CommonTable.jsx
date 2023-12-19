import {
  Box,
  IconButton,
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
import { Visibility } from "@mui/icons-material";
import { formatPhoneNumber } from "../utils/CustomFunctions";
import moment from "moment";

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
  onManageApprovers,
  onAddPriceChange,
  onVoid,
  onHistory,
  onDelete,
  onPrintFreebies,
  onTagUserInCluster,
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
  viewMoreKey,
  onViewMoreClick,
  disableActions,
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

                    let total = 0;
                    if (keys === "listingFee") {
                      item[keys]?.[0]?.listingItems?.forEach((item) => {
                        total += item.unitCost;
                      });
                    }

                    if (viewMoreKey === keys) {
                      return (
                        <TableCell key={k}>
                          <IconButton
                            sx={{ color: "secondary.main" }}
                            onClick={onViewMoreClick}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      );
                    }

                    if (keys === "phoneNumber") {
                      return (
                        <TableCell key={k}>
                          {item[keys] && "+63 " + formatPhoneNumber(item[keys])}
                        </TableCell>
                      );
                    }

                    if (keys === "createdAt") {
                      return (
                        <TableCell key={k}>
                          {item[keys] &&
                            moment(item[keys]).format("MMMM D, YYYY")}
                          {/* // H:mm a */}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={k}>
                        {pesoArray && pesoArray.includes(keys) && "₱ "}
                        {/* {keys === "phoneNumber" && "+63"} */}

                        {percentageArray && percentageArray.includes(keys)
                          ? item[keys] * 100
                          : pesoArray && pesoArray.includes(keys)
                          ? item[keys].toLocaleString()
                          : !item[keys]
                          ? "N/A"
                          : item[keys]}

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
                        onManageApprovers={
                          onManageApprovers && onManageApprovers
                        }
                        onAddPriceChange={onAddPriceChange && onAddPriceChange}
                        onVoid={onVoid && onVoid}
                        onHistory={onHistory && onHistory}
                        onPrintFreebies={onPrintFreebies && onPrintFreebies}
                        onDelete={onDelete && onDelete}
                        onTagUserInCluster={
                          onTagUserInCluster && onTagUserInCluster
                        }
                        item={item}
                        status={status}
                        disableActions={disableActions}
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
