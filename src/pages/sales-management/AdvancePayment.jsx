import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonTable from "../../components/CommonTable";
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
  useCreateAdvancePaymentMutation,
  useGetAllAdvancePaymentsQuery,
  useUpdateAdvancePaymentMutation,
  useVoidAdvancePaymentMutation,
} from "../../features/sales-management/api/advancePaymentApi";
import useConfirm from "../../hooks/useConfirm";
import ViewAdvancePaymentDetailsModal from "../../components/modals/sales-management/ViewAdvancePaymentDetailsModal";
import PageHeaderAddVoid from "../../components/PageHeaderAddVoid";
import ButtonFilterMixin from "../../components/mixins/ButtonFilterMixin";
import { Wallet } from "@mui/icons-material";
import AdvancePaymentBalancesModal from "../../components/modals/sales-management/AdvancePaymentBalancesModal";

function AdvancePayment() {
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const [origin, setOrigin] = useState("");

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

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: isBalancesOpen,
    onOpen: onBalancesOpen,
    onClose: onBalancesClose,
  } = useDisclosure();

  //RTK Query
  const [createAdvancePayment] = useCreateAdvancePaymentMutation();
  const { data: advancePaymentData, isFetching: isAdvancePaymentFetching } =
    useGetAllAdvancePaymentsQuery({
      Search: search,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      Origin: origin,
    });
  const [updateAdvancePayment] = useUpdateAdvancePaymentMutation();
  const [voidAdvancePayment] = useVoidAdvancePaymentMutation();

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

  const customOrderKeys = [
    "businessName",
    "fullname",
    "advancePaymentAmount",
    "paymentMethod",
    "createdAt",
  ];

  const pesoArray = ["advancePaymentAmount"];

  const disableActions = ["void"];

  const originOptions = [
    {
      value: " ",
      label: "All",
    },
    {
      value: "From Payment",
      label: "From Payment",
    },
    {
      value: "Manual Entry",
      label: "Manual Entry",
    },
  ];

  //Functions
  const onSubmit = async (data) => {
    let transformedData;

    if (data.paymentMethod.label === "Cheque") {
      transformedData = {
        clientId: data.clientId?.id,
        paymentMethod: data.paymentMethod?.value,
        advancePaymentAmount: data.advancePaymentAmount,
        payee: data.payee,
        chequeDate: data.chequeDate,
        bankName: data.bankName,
        chequeNo: data.chequeNo,
        dateReceived: data.dateReceived,
        // chequeAmount: Number(data.chequeAmount),
      };
    } else if (data.paymentMethod.label === "Online") {
      transformedData = {
        clientId: data.clientId?.id,
        paymentMethod: data.paymentMethod?.value,
        advancePaymentAmount: data.advancePaymentAmount,
        accountName: data.accountName,
        accountNo: data.accountNo,
      };
    } else {
      transformedData = {
        clientId: data.clientId?.id,
        paymentMethod: data.paymentMethod?.value,
        advancePaymentAmount: data.advancePaymentAmount,
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

  const onVoid = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to void advance payment for{" "}
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.businessName}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          voidAdvancePayment({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Advance Payment voided successfully!",
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

  // const handleEditOpen = () => {
  //   setEditMode(true);
  //   onFormOpen();

  //   setValue(
  //     "clientId",
  //     clientData?.regularClient?.find(
  //       (item) => item.clienId === selectedRowData?.id
  //     )
  //   );
  //   setValue(
  //     "paymentMethod",
  //     paymentTypesAdvPayment.find(
  //       (item) => item.value === selectedRowData?.paymentMethod
  //     )
  //   );
  //   setValue("advancePaymentAmount", selectedRowData?.advancePaymentAmount);

  //   if (selectedRowData?.paymentMethod === "Cheque") {
  //     setValue("payee", selectedRowData?.payee);
  //     setValue("chequeDate", moment(selectedRowData?.chequeDate));
  //     setValue("bankName", selectedRowData?.bankName);
  //     setValue("chequeNo", selectedRowData?.chequeNo);
  //     setValue("dateReceived", moment(selectedRowData?.dateReceived));
  //   }

  //   if (selectedRowData?.paymentMethod === "Online") {
  //     setValue("accountName", selectedRowData?.accountName);
  //     setValue("accountNo", selectedRowData?.accountNo);
  //     setValue("referenceNo", selectedRowData?.referenceNo);
  //   }
  // };

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
    <>
      <Box className="commonPageLayout">
        <PageHeaderAddVoid
          pageTitle="Advance Payment"
          onOpen={handleAddOpen}
          setSearch={setSearch}
          // selectOptions={originOptions}
          // setSelectValue={setOrigin}
        />

        <ButtonFilterMixin
          selectOptions={originOptions}
          setSelectValue={setOrigin}
          buttonTitle="Advance Payment Balances"
          buttonIcon={<Wallet />}
          onButtonClick={onBalancesOpen}
        />

        {isAdvancePaymentFetching ? (
          <CommonTableSkeleton
            // evenLesserCompact
            lowerCompact
          />
        ) : (
          <CommonTable
            mapData={advancePaymentData?.advancePayments}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            pesoArray={pesoArray}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            // evenLesserCompact
            lowerCompact
            // onEdit={handleEditOpen}
            onView={onViewOpen}
            onVoid={onVoid}
            disableActions={
              (selectedRowData?.origin === "From Payment" ||
                origin === "From Payment") &&
              disableActions
            }
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
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
                  Payment Type
                </Typography>

                <ControlledAutocomplete
                  name="paymentMethod"
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
                      helperText={errors?.paymentMethod?.message}
                      error={errors?.paymentMethod}
                    />
                  )}
                  onChange={(_, value) => {
                    if (value?.label !== "Cheque") {
                      setValue("payee", "");
                      setValue("chequeDate", null);
                      setValue("bankName", "");
                      setValue("chequeNo", "");
                      setValue("dateReceived", null);
                      // setValue("chequeAmount", "");
                    } else if (value?.label !== "Online") {
                      setValue("accountName", "");
                      setValue("accountNo", "");
                      setValue("referenceNo", "");
                    }
                    return value;
                  }}
                />
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
                  Advance Payment Amount
                </Typography>

                <Controller
                  control={control}
                  name={"advancePaymentAmount"}
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

            {watch("paymentMethod")?.label === "Cheque" && (
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

            {watch("paymentMethod")?.label === "Online" && (
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
                  name="accountNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Account Number"
                      size="small"
                      autoComplete="off"
                      {...field}
                      helperText={errors?.accountNo?.message}
                      error={errors?.accountNo}
                      type="number"
                    />
                  )}
                />

                <Controller
                  name="referenceNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Reference Number"
                      size="small"
                      autoComplete="off"
                      {...field}
                      helperText={errors?.referenceNo?.message}
                      error={errors?.referenceNo}
                      type="number"
                    />
                  )}
                />
              </Box>
            )}
          </Box>
        </CommonModalForm>
      </Box>

      <ViewAdvancePaymentDetailsModal open={isViewOpen} onClose={onViewClose} />

      <AdvancePaymentBalancesModal
        open={isBalancesOpen}
        onClose={onBalancesClose}
      />
    </>
  );
}

export default AdvancePayment;
