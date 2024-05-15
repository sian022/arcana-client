import {
  Box,
  Checkbox,
  IconButton,
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
import CommonActions from "./common/CommonActions";
import NoData from "../assets/images/NoRecordsFound.svg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../features/misc/reducers/selectedRowSlice";
import {
  Attachment,
  Cancel,
  CheckCircle,
  PriorityHigh,
  Visibility,
} from "@mui/icons-material";
import { formatPhoneNumber } from "../utils/CustomFunctions";
import moment from "moment";

function CommonTable({
  mt,
  mapData,
  tableHeads,
  customOrderKeys,
  includeActions = true,
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
  onCancel,
  onVoid,
  onHistory,
  onDelete,
  onPrintTTA,
  onPrintFreebies,
  onTagUserInCluster,
  onViewCluster,
  onResetPassword,
  onAttach,
  onManageProducts,
  onPriceChange,
  onRemove,
  onApprove,
  onReject,
  onPaymentHistories,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  count = 0,
  status,
  evenLesserCompact,
  lesserCompact,
  lessCompact,
  lowerCompact,
  compact,
  expanded,
  percentageArray,
  pesoArray,
  timeArray,
  dateTimeArray,
  dateTimeSplitArray,
  viewMoreKey,
  onViewMoreClick,
  onViewMoreConstant,
  onViewMoreConstantDisabled,
  attachKey,
  highlightSelected,
  disableActions,
  moveNoDataUp,
  checkboxSelection,
  checkedArray,
  setCheckedArray,
  warning,
  booleanDisplayOptions = [],
}) {
  const dispatch = useDispatch();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  if (!mapData || mapData.length === 0) {
    return (
      <Box
        className="noData"
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
        }}
      >
        <img
          src={NoData}
          alt="no-data-img"
          className="noData__image"
          style={{
            position: moveNoDataUp && "relative",
            bottom: moveNoDataUp && "10%",
          }}
        />
      </Box>
    );
  }

  var dataToMap = mapData;
  var tableHeadsList;

  const dataToMapKeys = Object.keys(dataToMap[0]);

  if (tableHeads) {
    tableHeadsList = tableHeads;
  } else {
    tableHeadsList = (customOrderKeys || dataToMapKeys).map((key) =>
      transformKey(key)
    );
  }

  const uppercaseKeys = ["storeType"];

  if (includeActions && !tableHeadsList.includes("Actions")) {
    tableHeadsList.push("Actions");
  }

  //Checkbox Selection
  const isAllSelected = dataToMap?.every((item, index) =>
    checkedArray?.includes(index)
  );

  const isIndeterminate =
    !isAllSelected &&
    dataToMap?.some((item, index) => checkedArray?.includes(index));

  const handleCheckboxChange = (index) => {
    // Check if the index is already in the array
    if (checkedArray.includes(index)) {
      // If it's present, remove it
      setCheckedArray(checkedArray.filter((item) => item !== index));
    } else {
      // If it's not present, add it
      setCheckedArray([...checkedArray, index]);
    }
  };

  const handleMasterCheckboxChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      setCheckedArray(dataToMap?.map((item, index) => index));
    } else {
      setCheckedArray([]);
    }
  };

  return (
    <Box className="tableSuperContainer" sx={{ mt: mt ? mt : null }}>
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
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {warning && <TableCell></TableCell>}

              {checkboxSelection && (
                <TableCell>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleMasterCheckboxChange}
                    sx={{ color: "white !important" }}
                  />
                </TableCell>
              )}

              {tableHeadsList.map((item, i) => (
                <TableCell
                  sx={{
                    position: item === "Actions" && "sticky",
                    right: item === "Actions" && 0,
                    bgcolor: item === "Actions" && "primary.main",
                  }}
                  key={i}
                >
                  {item}
                </TableCell>
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
                  sx={{
                    cursor: highlightSelected && "pointer",
                    bgcolor:
                      highlightSelected &&
                      shallowEqual(selectedRowData, item) &&
                      "#f3f3f3",
                  }}
                >
                  {warning && (
                    <TableCell>
                      {item[warning.key] === warning.value ? (
                        <PriorityHigh color="error" />
                      ) : null}
                    </TableCell>
                  )}

                  {checkboxSelection && (
                    <TableCell>
                      <Checkbox
                        checked={checkedArray?.includes(j)}
                        onChange={() => handleCheckboxChange(j)}
                      />
                    </TableCell>
                  )}

                  {(customOrderKeys || dataToMapKeys).map((keys, k) => {
                    if (
                      booleanDisplayOptions.some(
                        (option) => option.keyName === keys
                      )
                    ) {
                      const foundOption = booleanDisplayOptions.find(
                        (option) => option.keyName === keys
                      );

                      return (
                        <TableCell key={k}>
                          {item[keys]
                            ? foundOption?.trueDisplay
                            : foundOption?.falseDisplay}
                        </TableCell>
                      );
                    }

                    if (item[keys] === true && keys !== attachKey) {
                      return (
                        <TableCell key={k}>
                          <CheckCircle color="success" />
                        </TableCell>
                      );
                    }

                    if (item[keys] === false && keys !== attachKey) {
                      return (
                        <TableCell key={k}>
                          <Cancel color="error" />
                        </TableCell>
                      );
                    }

                    if (keys === attachKey) {
                      return (
                        <TableCell key={k}>
                          <Attachment
                            sx={{
                              color: !item[keys]
                                ? "error.main"
                                : "success.main",
                            }}
                          />
                        </TableCell>
                      );
                    }

                    if (viewMoreKey === keys) {
                      return (
                        <TableCell key={k}>
                          <IconButton
                            sx={{ color: "secondary.main", p: 0 }}
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

                    if (keys === "origin") {
                      return (
                        <TableCell key={k}>
                          {item[keys] === "Prospecting"
                            ? "Prospect"
                            : item[keys]}
                        </TableCell>
                      );
                    }

                    //Override createdAt or updatedAt default formatting if time only
                    if (timeArray?.includes(keys)) {
                      return (
                        <TableCell key={k}>
                          {item[keys] && moment(item[keys]).format("hh:mm a")}
                        </TableCell>
                      );
                    }

                    if (dateTimeArray?.includes(keys)) {
                      return (
                        <TableCell key={k}>
                          {item[keys] &&
                            moment(item[keys]).format("MMM D, YYYY hh:mm a")}
                        </TableCell>
                      );
                    }

                    if (dateTimeSplitArray?.includes(keys)) {
                      return (
                        <React.Fragment key={k}>
                          <TableCell>
                            {item[keys] &&
                              moment(item[keys]).format("MMM DD, YYYY")}
                          </TableCell>
                          <TableCell key={k}>
                            {item[keys] && moment(item[keys]).format("hh:mm a")}
                          </TableCell>
                        </React.Fragment>
                      );
                    }

                    if (keys === "createdAt" || keys === "updatedAt") {
                      return (
                        <TableCell key={k}>
                          {item[keys] &&
                            moment(item[keys]).format("MMM DD, YYYY")}
                          {/* // H:mm a */}
                        </TableCell>
                      );
                    }

                    if (uppercaseKeys.includes(keys)) {
                      return (
                        <TableCell key={k}>
                          {item[keys]?.toUpperCase()}
                        </TableCell>
                      );
                    }

                    if (
                      onViewMoreConstant &&
                      k === (customOrderKeys || dataToMapKeys).length - 1
                    ) {
                      return (
                        <React.Fragment key={k}>
                          <TableCell>
                            {/* Content of the last regular column */}
                            {pesoArray && pesoArray.includes(keys) && "₱ "}

                            {percentageArray && percentageArray.includes(keys)
                              ? (item[keys] * 100)?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionsDigits: 2,
                                })
                              : pesoArray && pesoArray.includes(keys)
                              ? item[keys]?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : !item[keys]
                              ? "N/A"
                              : item[keys]}

                            {percentageArray &&
                              percentageArray.includes(keys) &&
                              "%"}
                          </TableCell>

                          <TableCell>
                            {/* Additional column for onViewMoreConstant */}
                            <IconButton
                              sx={{ color: "secondary.main" }}
                              onClick={onViewMoreConstant}
                              disabled={onViewMoreConstantDisabled}
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </React.Fragment>
                      );
                    }

                    return (
                      <TableCell key={k}>
                        {pesoArray && pesoArray.includes(keys) && "₱"}
                        {/* {keys === "phoneNumber" && "+63"} */}

                        {percentageArray && percentageArray.includes(keys)
                          ? (item[keys] * 100)?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionsDigits: 2,
                            })
                          : pesoArray && pesoArray.includes(keys)
                          ? item[keys]?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : !item[keys]
                          ? "N/A"
                          : item[keys]}

                        {percentageArray &&
                          percentageArray.includes(keys) &&
                          "%"}
                      </TableCell>
                    );
                  })}

                  {includeActions && (
                    <TableCell
                      sx={{
                        position: "sticky",
                        right: 0,
                        bgcolor: "white !important",
                      }}
                    >
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
                        onPrintTTA={onPrintTTA && onPrintTTA}
                        onPrintFreebies={onPrintFreebies && onPrintFreebies}
                        onDelete={onDelete && onDelete}
                        onTagUserInCluster={
                          onTagUserInCluster && onTagUserInCluster
                        }
                        onViewCluster={onViewCluster && onViewCluster}
                        onCancel={onCancel && onCancel}
                        onResetPassword={onResetPassword && onResetPassword}
                        onManageProducts={onManageProducts && onManageProducts}
                        onPriceChange={onPriceChange && onPriceChange}
                        onAttach={onAttach && onAttach}
                        onRemove={onRemove && onRemove}
                        onApprove={onApprove && onApprove}
                        onReject={onReject && onReject}
                        onPaymentHistories={
                          onPaymentHistories && onPaymentHistories
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
