import { useEffect } from "react";
import CommonModalForm from "../../CommonModalForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentSchema } from "../../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import ControlledAutocomplete from "../../ControlledAutocomplete";
import { Box, TextField, Typography } from "@mui/material";
import { paymentTypes } from "../../../utils/Constants";
import { NumericFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import useSnackbar from "../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import useConfirm from "../../../hooks/useConfirm";
import moment from "moment";

function PaymentModalForm({
  editMode,
  appendPayment,
  updatePayment,
  cashExists,
  remainingBalance,
  selectedPayment,
  ...props
}) {
  const { open, onClose } = props;

  //Hooks
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
    resolver: yupResolver(paymentSchema.schema),
    mode: "onChange",
    defaultValues: paymentSchema.defaultValues,
  });

  //Watch Constants
  const watchPaymentMethod = watch("paymentMethod");

  //Functions
  const onSubmit = async (data) => {
    try {
      await confirm({
        children: "Are you sure you want to add this payment?",
        question: true,
        callback: () =>
          editMode
            ? updatePayment(selectedPayment.index, data)
            : appendPayment(data),
      });

      snackbar({ message: "Payment added successfully", type: "success" });
      onClose();
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), type: "error" });
      }
    }
  };

  //UseEffect
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (editMode && open) {
      const { index, ...paymentInfo } = selectedPayment;

      Object.keys(paymentInfo).forEach((key) => {
        if (key === "chequeDate" || key === "dateReceived") {
          setValue(key, paymentInfo[key] ? moment(paymentInfo[key]) : null);
          return;
        }
        setValue(key, paymentInfo[key]);
      });
    }
  }, [open, editMode, selectedPayment, setValue]);

  useEffect(() => {
    if (watchPaymentMethod?.label === "Cash") {
      setValue("paymentAmount", remainingBalance);
    }
  }, [watchPaymentMethod, setValue, remainingBalance]);

  return (
    <CommonModalForm
      title="Payment Form"
      {...props}
      // open={isModalFormOpen}
      // onClose={handleFormClose}
      onSubmit={handleSubmit(onSubmit)}
      disableSubmit={!isValid || !isDirty}
      width="800px"
      height="450px"
    >
      <Box className="paymentTransactionModal">
        <Box className="paymentTransactionModal__header">
          <Box className="paymentTransactionModal__header__item">
            <Typography>Payment Type</Typography>

            <ControlledAutocomplete
              name="paymentMethod"
              control={control}
              options={
                cashExists
                  ? paymentTypes.filter((type) => type.label !== "Cash")
                  : paymentTypes
              }
              getOptionLabel={(option) => option.label.toUpperCase()}
              disableClearable
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Payment Type"
                  helperText={errors?.paymentMethod?.message}
                  error={errors?.paymentMethod}
                />
              )}
              onChange={(_, value) => {
                if (value.label !== "Cheque") {
                  setValue("payee", "");
                  setValue("chequeDate", null);
                  setValue("bankName", "");
                  setValue("chequeNo", "");
                  setValue("dateReceived", null);
                  // setValue("chequeAmount", "");
                }
                if (value.label !== "Online") {
                  setValue("accountName", "");
                  setValue("accountNo", "");
                  setValue("referenceNumber", "");
                }
                if (value.label !== "Offset") {
                  setValue("remarks", "");
                }
                return value;
              }}
            />
          </Box>

          <Box className="paymentTransactionModal__header__item">
            <Typography>Payment Amount</Typography>

            <Controller
              control={control}
              name={"paymentAmount"}
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
                  disabled={watchPaymentMethod?.label === "Cash"}
                />
              )}
            />
          </Box>
        </Box>

        {watch("paymentMethod")?.label === "Cheque" && (
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
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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

        {watch("paymentMethod")?.label === "Listing Fee" && (
          <Box className="paymentTransactionModal__footer">
            <Box className="paymentTransactionModal__footer__label">
              <Typography className="paymentTransactionModal__footer__label__top">
                Listing Fee
              </Typography>

              <Typography className="paymentTransactionModal__footer__label__bottom">
                (Current Balance)
              </Typography>
            </Box>

            <Typography className="paymentTransactionModal__footer__value">
              ₱
              {2000?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        )}

        {watch("paymentMethod")?.label === "Offset" && (
          <Box className="paymentTransactionModal__otherFields">
            <Controller
              name="remarks"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Remarks"
                  size="small"
                  autoComplete="off"
                  multiline
                  maxRows={3}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  helperText={errors?.remarks?.message}
                  error={errors?.remarks}
                />
              )}
            />
          </Box>
        )}

        {watch("paymentMethod")?.label === "Advance Payment" && (
          <Box className="paymentTransactionModal__footer">
            <Box className="paymentTransactionModal__footer__label">
              <Typography className="paymentTransactionModal__footer__label__top">
                Advance Payment
              </Typography>

              <Typography className="paymentTransactionModal__footer__label__bottom">
                (Current Balance)
              </Typography>
            </Box>

            <Typography className="paymentTransactionModal__footer__value">
              ₱
              {30000?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        )}
      </Box>
    </CommonModalForm>
  );
}

export default PaymentModalForm;
