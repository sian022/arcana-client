import { Box, TextField, debounce } from "@mui/material";
import React, { useState } from "react";
import { useGetAllReleasedProspectsQuery } from "../../../features/prospect/api/prospectApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import CommonTable from "../../../components/CommonTable";

function Released() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  //Constants
  const excludeKeys = [
    "createdAt",
    "isActive",
    "origin",
    "addedBy",
    "freebies",
  ];

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const { data, isLoading } = useGetAllReleasedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  return (
    <Box>
      <TextField
        type="search"
        size="small"
        label="Search"
        onChange={(e) => {
          debouncedSetSearch(e.target.value);
        }}
        autoComplete="off"
        sx={{ mb: 2 }}
      />

      {isLoading ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.releasedProspecting}
          excludeKeys={excludeKeys}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
        />
      )}
    </Box>
  );
}

export default Released;
