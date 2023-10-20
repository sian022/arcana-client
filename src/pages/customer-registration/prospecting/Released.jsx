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
import CommonModal from "../../../components/CommonModal";
import CommonDrawer from "../../../components/CommonDrawer";

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
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            // excludeKeys={excludeKeys}
            excludeKeysDisplay={excludeKeysDisplay}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            editable
            onRegularRegister={onRegisterOpen}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
          />
        )}
      </Box>

      {/* <CommonModal open={isRegisterOpen} onClose={onRegisterClose}>
        Hi Mom!
      </CommonModal> */}

      <CommonDrawer
        drawerHeader="Register as Regular"
        open={isRegisterOpen}
        onClose={onRegisterClose}
        width="1000px"
        // disableSubmit={!isValid}
        // onSubmit={
        //   // handleSubmit(onDrawerSubmit)
        //   onConfirmOpen
        // }
      >
        <Typography>Customer's Information</Typography>
        <TextField
          label="Owner's Name"
          size="small"
          autoComplete="off"
          required
          // {...register("ownersName")}
          // helperText={errors?.ownersName?.message}
          // error={errors?.ownersName}
        />
        {/* <TextField
          label="Owner's Address"
          size="small"
          autoComplete="off"
          required
          // {...register("ownersAddress")}
          // helperText={errors?.ownersAddress?.message}
          // error={errors?.ownersAddress}
        /> */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <TextField
            label="Phone Number"
            size="small"
            autoComplete="off"
            required
            // {...register("phoneNumber")}
            // helperText={errors?.phoneNumber?.message}
            // error={errors?.phoneNumber}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Business Name"
            size="small"
            autoComplete="off"
            required
            // {...register("businessName")}
            // helperText={errors?.businessName?.message}
            // error={errors?.businessName}
            sx={{ flex: 1 }}
          />
        </Box>
      </CommonDrawer>
    </>
  );
}

export default Released;
