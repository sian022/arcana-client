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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { paymentTypesAdvPayment } from "../../utils/Constants";

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

      <CommonModalForm
        title="Advance Payment"
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormClose}
        width="800px"
        height="520px"
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

              <ControlledAutocomplete
                name="paymentType"
                control={control}
                options={paymentTypesAdvPayment}
                getOptionLabel={(option) => option.label.toUpperCase()}
                disableClearable
                // disabled={!watch("clientId")}
                isOptionEqualToValue={(option, value) => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Payment Type"
                    // required
                    helperText={errors?.paymentType?.message}
                    error={errors?.paymentType}
                  />
                )}
              />
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
                    label="Advance Payment Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(Number(e.value));
                    }}
                    onBlur={onBlur}
                    value={value || ""}
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">₱</InputAdornment>
                    //   ),
                    // }}
                    // ref={ref}
                    // required
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    // disabled={!watch("clientId")}
                  />
                )}
              />
            </Box>
          </Box>

          {watch("paymentType")?.label === "Cheque" && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                mt: "20px",
              }}
            >
              <Controller
                name="payee"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Payee"
                    size="small"
                    autoComplete="off"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    helperText={errors?.payee?.message}
                    error={errors?.payee}
                  />
                )}
              />

              <Controller
                name="chequeDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      {...field}
                      label="Cheque Date"
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={errors?.chequeDate?.message}
                          error={errors?.chequeDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                name="bankName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Bank Name"
                    size="small"
                    autoComplete="off"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    helperText={errors?.bankName?.message}
                    error={errors?.bankName}
                  />
                )}
              />

              <Controller
                name="chequeNo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Cheque No."
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.chequeNo?.message}
                    error={errors?.chequeNo}
                    type="number"
                  />
                )}
              />

              <Controller
                name="dateReceived"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      {...field}
                      label="Date Received"
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={errors?.dateReceived?.message}
                          error={errors?.dateReceived}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                control={control}
                name={"chequeAmount"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    label="Cheque Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(Number(e.value));
                    }}
                    onBlur={onBlur}
                    value={value || ""}
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">₱</InputAdornment>
                    //   ),
                    // }}
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                  />
                )}
              />
            </Box>
          )}
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
