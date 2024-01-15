import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonTable from "../../components/CommonTable";
import { dummyTableData } from "../../utils/DummyData";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../../components/CommonDialog";
import { useSelector } from "react-redux";
import CommonModalForm from "../../components/CommonModalForm";
import { useGetAllClientsForListingFeeQuery } from "../../features/registration/api/registrationApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { advancePaymentSchema } from "../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NumericFormat } from "react-number-format";

function AdvancePayment() {
  const [drawerMode, setDrawerMode] = useState("add");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(advancePaymentSchema.schema),
    mode: "onSubmit",
    defaultValues: advancePaymentSchema.defaultValues,
  });

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
  } = useDisclosure();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  //RTK Query
  const {
    data: clientData,
    isLoading: isClientLoading,
    refetch: refetchClients,
  } = useGetAllClientsForListingFeeQuery({
    Status: true,
    PageNumber: 1,
    PageSize: 1000,
    IncludeRejected: drawerMode === "edit" ? true : "",
  });

  const isFetching = false;

  const handleAddOpen = () => {
    setDrawerMode("add");
    // onDrawerOpen();
    onFormOpen();
  };

  const handleDrawerClose = () => {
    // reset();
    onDrawerClose();
    setSelectedId("");
  };

  const handleFormClose = () => {
    reset();
    onFormClose();
    setSelectedId("");
  };

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Advance Payment"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={dummyTableData}
          // excludeKeysDisplay={excludeKeysDisplay}
          // tableHeads={tableHeads}
          editable
          archivable
          // onEdit={handleEditOpen}
          // onArchive={handleArchiveOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
          midCompact
        />
      )}

      <CommonDrawer
        // open={isDrawerOpen}
        // onClose={handleDrawerClose}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Advance Payment"
        }
        // onSubmit={handleSubmit(onDrawerSubmit)}
        // disableSubmit={!isValid}
        // isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Business Type Name"
          size="small"
          autoComplete="off"
          // {...register("storeTypeName")}
          // helperText={errors?.storeTypeName?.message}
          // error={errors?.storeTypeName}
        />
      </CommonDrawer>

      <CommonModalForm
        title="Advance Payment"
        open={isFormOpen}
        onClose={handleFormClose}
        width={"800px"}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              Business Info
            </Typography>

            <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() || ""
              }
              disableClearable
              loading={isClientLoading}
              disabled={drawerMode === "edit"}
              // value={clientData?.regularClient?.find(
              //   (item) => item.businessName === selectedRowData?.businessName
              // )}
              // isOptionEqualToValue={(option, value) => option.id === value.id}
              isOptionEqualToValue={(option, value) => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name - Owner's Name"
                  // required
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                />
              )}
              onChange={(_, value) => {
                if (watch("clientId") && watch("listingItems")[0]?.itemId) {
                  onClientConfirmationOpen();
                  setConfirmationValue(value);
                  return watch("clientId");
                } else {
                  return value;
                }
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
                Payment Type
              </Typography>

              <TextField
                size="small"
                select
                disabled={!watch("clientId")}
                label="Payment Type"
              >
                <MenuItem value="Cheque">CHEQUE</MenuItem>
                <MenuItem value="Cash">CASH</MenuItem>
                <MenuItem value="Online">ONLINE</MenuItem>
                <MenuItem value="Listing Fee">LISTING FEE</MenuItem>
                <MenuItem value="Offset">OFFSET</MenuItem>
                <MenuItem value="Adv. Payment">ADV. PAYMENT</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
                Advance Payment Amount
              </Typography>

              <Controller
                control={control}
                name={"amount"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    // label="Advance Payment Amount"
                    placeholder="Advance Payment Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(Number(e.value));
                    }}
                    onBlur={onBlur}
                    value={value || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    // ref={ref}
                    // required
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    disabled={!watch("clientId")}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </CommonModalForm>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        // onYes={onArchiveSubmit}
        // isLoading={isArchiveLoading}
        noIcon={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.storeTypeName}
        </span>
        ?
      </CommonDialog>
    </Box>
  );
}

export default AdvancePayment;
