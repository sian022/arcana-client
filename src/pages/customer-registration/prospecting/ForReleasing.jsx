import React, { useEffect, useState } from "react";
import AddArchiveSearchMixin from "../../../components/mixins/AddArchiveSearchMixin";
import useDisclosure from "../../../hooks/useDisclosure";
import { Box, TextField, Typography } from "@mui/material";
import CommonTable from "../../../components/CommonTable";
import CommonDrawer from "../../../components/CommonDrawer";
import { prospectSchema } from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { useGetAllApprovedProspectsQuery } from "../../../features/prospect/api/prospectApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";

function ForReleasing() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  //Disclosures
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  //Constants
  const excludeKeys = ["createdAt", "isActive", "origin", "addedBy"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(prospectSchema.schema),
    mode: "onChange",
    defaultValues: prospectSchema.defaultValues,
  });

  //RTK Query
  const { data, isLoading } = useGetAllApprovedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const { data: storeTypeData } = useGetAllStoreTypesQuery();

  //Drawer Handlers
  const handleEditOpen = () => {};

  const handleArchiveOpen = () => {};

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  return (
    <>
      <Box>
        <AddArchiveSearchMixin
          addTitle="Prospect"
          onAddOpen={onAddOpen}
          setStatus={setStatus}
          setSearch={setSearch}
        />
        {isLoading ? (
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            excludeKeys={excludeKeys}
            editable
            archivable
            onEdit={handleEditOpen}
            onArchive={handleArchiveOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
          />
        )}
      </Box>

      <CommonDrawer
        drawerHeader="Add Prospect"
        open={isAddOpen}
        onClose={onAddClose}
        width="1000px"
        disableSubmit={!isValid}
      >
        <TextField
          label="Owner's Name"
          size="small"
          autoComplete="off"
          required
          {...register("ownersName")}
          helperText={errors?.ownersName?.message}
          error={errors?.ownersName}
        />
        <TextField
          label="Owner's Address"
          size="small"
          autoComplete="off"
          required
          {...register("ownersAddress")}
          helperText={errors?.ownersAddress?.message}
          error={errors?.ownersAddress}
        />
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
            {...register("phoneNumber")}
            helperText={errors?.phoneNumber?.message}
            error={errors?.phoneNumber}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Business Name"
            size="small"
            autoComplete="off"
            required
            {...register("businessName")}
            helperText={errors?.businessName?.message}
            error={errors?.businessName}
            sx={{ flex: 1 }}
          />
        </Box>
        <ControlledAutocomplete
          name={"storeTypeId"}
          control={control}
          options={storeTypeData?.storeTypes}
          getOptionLabel={(option) => option.storeTypeName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Store Type"
              required
              helperText={errors?.storeTypeId?.message}
              error={errors?.storeTypeId}
            />
          )}
        />
      </CommonDrawer>
    </>
  );
}

export default ForReleasing;
