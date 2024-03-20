import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonTable from "../../components/CommonTable";
import { dummyAdvancePaymentData } from "../../utils/DummyData";
import useDisclosure from "../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import CommonModalForm from "../../components/CommonModalForm";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { advancePaymentSchema } from "../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NumericFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { paymentTypesAdvPayment } from "../../utils/Constants";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import {
  useCancelAdvancePaymentMutation,
  useCreateAdvancePaymentMutation,
  useGetAllAdvancePaymentsQuery,
  useUpdateAdvancePaymentMutation,
} from "../../features/sales-management/api/advancePaymentApi";
import useConfirm from "../../hooks/useConfirm";

function AdvancePayment() {
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(advancePaymentSchema.schema),
    mode: "onSubmit",
    defaultValues: advancePaymentSchema.defaultValues,
  });

  //Disclosures

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  //RTK Query
  const [createAdvancePayment] = useCreateAdvancePaymentMutation();
  const { data: advancePaymentData, isFetching: isAdvancePaymentFetching } =
    useGetAllAdvancePaymentsQuery({
      Search: search,
      Page: page + 1,
      PageSize: rowsPerPage,
    });
  const [updateAdvancePayment] = useUpdateAdvancePaymentMutation();
  const [cancelAdvancePayment] = useCancelAdvancePaymentMutation();

  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageNumber: 1,
      PageSize: 1000,
    });

  //Constants
  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Amount",
    "Payment Type",
    "Created At",
  ];

  const pesoArray = ["amount"];

  //Functions
  const onSubmit = async (data) => {
    let transformedData;

    if (data.paymentType.label === "Cheque") {
      transformedData = {
        clientId: data.clientId?.id,
        paymentType: data.paymentType?.value,
        amount: data.amount,
        payee: data.payee,
        chequeDate: data.chequeDate,
        bankName: data.bankName,
        chequeNumber: data.chequeNumber,
        dateReceived: data.dateReceived,
        // chequeAmount: Number(data.chequeAmount),
      };
    } else if (data.paymentType.label === "Online") {
      transformedData = {
        clientId: data.clientId?.id,
        paymentType: data.paymentType?.value,
        amount: data.amount,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
      };
    } else {
      transformedData = {
        clientId: data.clientId?.id,
        paymentType: data.paymentType?.value,
        amount: data.amount,
      };
    }

    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {editMode ? "update" : "add"} advance
            payment for{" "}
            <span style={{ fontWeight: "700" }}>
              {watch("clientId")?.businessName}
            </span>
            ?
          </>
        ),
        question: true,
        callback: () =>
          editMode
            ? updateAdvancePayment({
                id: selectedRowData?.id,
                ...transformedData,
              }).unwrap()
            : createAdvancePayment(transformedData).unwrap(),
      });

      snackbar({
        message: "Advance Payment added successfully!",
        variant: "success",
      });
      handleFormClose();
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const onCancel = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to cancel advance payment for{" "}
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.businessName}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          cancelAdvancePayment({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Advance Payment canceled successfully!",
        variant: "success",
      });
      handleFormClose();
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const handleAddOpen = () => {
    setEditMode(false);
    onFormOpen();
  };

  const handleEditOpen = () => {
    setEditMode(true);
    onFormOpen();

    setValue(
      "clientId",
      clientData?.regularClient?.find(
        (item) => item.clienId === selectedRowData?.id
      )
    );
    setValue(
      "paymentType",
      paymentTypesAdvPayment.find(
        (item) => item.value === selectedRowData?.paymentType
      )
    );
    setValue("amount", selectedRowData?.amount);
  };

  const handleFormClose = () => {
    reset();
    onFormClose();
  };

  // UseEffect
  useEffect(() => {
    setCount(advancePaymentData?.totalCount);
  }, [advancePaymentData]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Advance Payment"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        removeArchive
      />

      {isAdvancePaymentFetching ? (
        <CommonTableSkeleton lesserCompact />
      ) : (
        <CommonTable
          mapData={advancePaymentData || dummyAdvancePaymentData}
          tableHeads={tableHeads}
          pesoArray={pesoArray}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          lesserCompact
          onEdit={handleEditOpen}
          onCancel={onCancel}
        />
      )}

      <CommonModalForm
        title="Advance Payment"
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit(onSubmit)}
        disableSubmit={!isValid || !isDirty}
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
              disabled={editMode}
              isOptionEqualToValue={() => true}
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
                isOptionEqualToValue={() => true}
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
                onChange={(_, value) => {
                  if (value?.label !== "Cheque") {
                    setValue("payee", "");
                    setValue("chequeDate", null);
                    setValue("bankName", "");
                    setValue("chequeNumber", "");
                    setValue("dateReceived", null);
                    // setValue("chequeAmount", "");
                  } else if (value?.label !== "Online") {
                    setValue("accountName", "");
                    setValue("accountNumber", "");
                    setValue("referenceNumber", "");
                  }
                  return value;
                }}
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
                      onChange(e.value === "" ? null : Number(e.value));
                    }}
                    inputRef={ref}
                    onBlur={onBlur}
                    value={value || ""}
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix="₱"
                    decimalScale={2}
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
                name="chequeNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Cheque No."
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.chequeNumber?.message}
                    error={errors?.chequeNumber}
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

              {/* <Controller
                control={control}
                name="chequeAmount"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    label="Cheque Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(e.value === "" ? null : Number(e.value));
                    }}
                    onBlur={onBlur}
                    inputRef={ref}
                    value={value || ""}
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix="₱"
                    decimalScale={2}
                  />
                )}
              /> */}
            </Box>
          )}

          {watch("paymentType")?.label === "Online" && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                mt: "20px",
              }}
            >
              <Controller
                name="accountName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Account Name"
                    size="small"
                    autoComplete="off"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    helperText={errors?.accountName?.message}
                    error={errors?.accountName}
                  />
                )}
              />

              <Controller
                name="accountNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Account Number"
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.accountNumber?.message}
                    error={errors?.accountNumber}
                    type="number"
                  />
                )}
              />

              <Controller
                name="referenceNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Reference Number"
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.referenceNumber?.message}
                    error={errors?.referenceNumber}
                    type="number"
                  />
                )}
              />
            </Box>
          )}
        </Box>
      </CommonModalForm>
    </Box>
  );
}

export default AdvancePayment;
