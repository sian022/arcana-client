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
import { transformKey } from "../utils/CustomFunctions";
import CommonActions from "./common/CommonActions";
import NoData from "../assets/images/NoRecordsFound.svg";
import { useDispatch } from "react-redux";
import { setSelectedRow } from "../features/misc/reducers/selectedRowSlice";

function RoleTable({
  mapData,
  excludeKeys,
  tableHeads,
  includeActions = true,
  onEdit,
  onArchive,
  onTag,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  count = 0,
  status,
  evenLesserCompact,
}) {
  const dispatch = useDispatch();

  if (!mapData || mapData.length === 0) {
    return (
      <Box
        className="noData"
        sx={{ height: evenLesserCompact ? "calc(100vh - 262px)" : null }}
      >
        <img src={NoData} alt="no-data-img" className="noData__image" />
      </Box>
    );
  }

  var dataToMap = mapData;
  var tableHeadsList;

  if (excludeKeys) {
    const filteredData = mapData?.map((obj) => {
      const filteredObj = Object.fromEntries(
        Object.entries(obj).filter(([key]) => !excludeKeys.includes(key))
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

  if (includeActions && !tableHeadsList.includes("Actions")) {
    tableHeadsList.push("Actions");
  }

  return (
    <Box className="tableSuperContainer">
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
        sx={{ height: evenLesserCompact ? "calc(100vh - 262px)" : null }}
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
                    if (keys === "id" || keys === "permissions") {
                      return null;
                    }
                    return <TableCell key={k}>{item[keys]}</TableCell>;
                  })}
                  {includeActions && (
                    <TableCell>
                      <CommonActions
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onTag={onTag}
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

export default RoleTable;
