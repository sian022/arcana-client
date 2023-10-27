import { Box, TextField, Typography, debounce } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  useGetAllApprovedProspectsQuery,
  useGetAllReleasedProspectsQuery,
} from "../../../features/prospect/api/prospectApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import CommonTable from "../../../components/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import { setBadge } from "../../../features/prospect/reducers/badgeSlice";
import useDisclosure from "../../../hooks/useDisclosure";
import RegisterRegularForm from "./RegisterRegularForm";

function Released() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const badges = useSelector((state) => state.badge.value);
  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  //Constants
  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "isActive",
    "origin",
    "addedBy",
    "status",
    "freebies",
    "ownersAddress",
    "registrationStatus",
  ];

  const tableHeads = [
    "Owner's Name",
    "Mobile Number",
    "Email Address",
    "Business Name",
    "Business Type",
  ];

  //Disclosures
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  //RTK Query
  const { data, isLoading } = useGetAllApprovedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
    // WithFreebies: true,
    FreebieStatus: "Released",
  });

  //Misc Functions
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  ///UseEffects
  useEffect(() => {
    setCount(data?.totalCount);
    dispatch(setBadge({ ...badges, released: data?.totalCount }));
  }, [data]);

  return (
    <>
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
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            // excludeKeys={excludeKeys}
            tableHeads={tableHeads}
            excludeKeysDisplay={excludeKeysDisplay}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            editable
            onRegularRegister={onRegisterOpen}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
            compact
          />
        )}
      </Box>

      {/* <AttachmentsProvider> */}
      <RegisterRegularForm open={isRegisterOpen} onClose={onRegisterClose} />
      {/* </AttachmentsProvider> */}
    </>
  );
}

export default Released;
