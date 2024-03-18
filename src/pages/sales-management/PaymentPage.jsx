import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { useState } from "react";
import DangerButton from "../../components/DangerButton";
import SecondaryButton from "../../components/SecondaryButton";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentTransactionSchema } from "../../schema/schema";
import useDisclosure from "../../hooks/useDisclosure";
import CommonModalForm from "../../components/CommonModalForm";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { paymentTypes } from "../../utils/Constants";
import { NumericFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function PaymentPage({ setPaymentMode }) {
  const [client, setClient] = useState(null);

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(paymentTransactionSchema.schema),
    mode: "onChange",
    defaultValues: paymentTransactionSchema.defaultValues,
  });

  // Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

  //RTK Query
  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageNumber: 1,
      PageSize: 1000,
    });

  //Functions
  const onSubmit = async (data) => {
    console.log(data);
  };

  const handleFormClose = () => {
    reset();
    onModalFormClose();
  };

  return (
    <>
      <Box className="paymentPage">
        <Box className="paymentPage__header">
          <Box className="paymentPage__header__left">
            <IconButton onClick={() => setPaymentMode(false)}>
              <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
            </IconButton>

            <Typography className="paymentPage__header__left__title">
              Payment Transaction
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="paymentPage__filters">
          <Autocomplete
            options={clientData?.regularClient || []}
            getOptionLabel={(option) =>
              option.businessName?.toUpperCase() +
                " - " +
                option.ownersName?.toUpperCase() || ""
            }
            disableClearable
            loading={isClientFetching}
            isOptionEqualToValue={() => true}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Business Name - Owner's Name"
              />
            )}
            value={client}
            onChange={(_, value) => setClient(value)}
            sx={{ width: "40%" }}
          />

          <TextField
            type="search"
            size="small"
            label="Search"
            // onChange={(e) => {
            //   debouncedSetSearch(e.target.value);
            // }}
            autoComplete="off"
          />
        </Box>

        {client && (
          <Box className="paymentPage__body">
            <Box className="paymentPage__body__transactions">
              <Box className="paymentPage__body__transactions__transactionsList">
                {Array.from({ length: 9 }).map((item, index) => (
                  <Box
                    key={index}
                    className="paymentPage__body__transactions__transactionsList__item"
                  >
                    a
                  </Box>
                ))}
              </Box>

              <Box className="paymentPage__body__transactions__actions">
                <DangerButton>Void</DangerButton>
                <SecondaryButton>Pay</SecondaryButton>
              </Box>
            </Box>

            <Box className="paymentPage__body__payments"></Box>
          </Box>
        )}
      </Box>

      <CommonModalForm
        title="Payment Transaction"
        open={isModalFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit(onSubmit)}
        disableSubmit={!isValid || !isDirty}
        width="800px"
        height="440px"
      >
        <Box className="paymentTransactionModal">
          <Box className="paymentTransactionModal__header">
            <Box className="paymentTransactionModal__header__item">
              <Typography>Payment Type</Typography>

              <ControlledAutocomplete
                name="paymentType"
                control={control}
                options={paymentTypes}
                getOptionLabel={(option) => option.label.toUpperCase()}
                disableClearable
                isOptionEqualToValue={() => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Payment Type"
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
                    setValue("chequeAmount", "");
                  } else if (value?.label !== "Online") {
                    setValue("accountName", "");
                    setValue("accountNumber", "");
                  }
                  return value;
                }}
              />
            </Box>

            <Box className="paymentTransactionModal__header__item">
              <Typography>Payment Amount</Typography>

              <Controller
                control={control}
                name={"amount"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    label="Payment Amount"
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
                  />
                )}
              />
            </Box>
          </Box>

          {watch("paymentType")?.label === "Cheque" && (
            <Box className="paymentTransactionModal__otherFields">
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

              <Controller
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
              />
            </Box>
          )}

          {watch("paymentType")?.label === "Online" && (
            <Box className="paymentTransactionModal__otherFields">
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
                    label="Account No."
                    size="small"
                    autoComplete="off"
                    {...field}
                    helperText={errors?.accountNumber?.message}
                    error={errors?.accountNumber}
                    type="number"
                  />
                )}
              />
            </Box>
          )}
        </Box>
      </CommonModalForm>
    </>
  );
}

export default PaymentPage;
