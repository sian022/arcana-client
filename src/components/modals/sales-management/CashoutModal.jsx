import { useEffect, useRef } from "react";
import CommonModalForm from "../../CommonModalForm";
import { Controller, useForm } from "react-hook-form";
import { cashoutSchema } from "../../../schema/schema";
import { Box, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../hooks/useSnackbar";
import CommonDialog from "../../CommonDialog";
import useDisclosure from "../../../hooks/useDisclosure";

function CashoutModal({ total, resetTransaction, orderData, ...props }) {
  const { onClose, open } = props;

  const snackbar = useSnackbar();

  //Disclosures
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const chargeInvoiceRef = useRef();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(cashoutSchema.schema),
    mode: "onSubmit",
    defaultValues: cashoutSchema.defaultValues,
  });

  //Functions
  const onSubmit = (data) => {
    const transformedOrderData = {
      clientId: orderData?.clientId?.id,
      items: orderData?.items?.map((item) => ({
        itemId: item?.itemId?.id,
        quantity: item?.quantity,
      })),
    };

    const combinedData = { ...transformedOrderData, ...data };

    try {
      console.log(combinedData);
      resetTransaction();
      handleClose();
      onConfirmClose();
      snackbar({
        message: "Transaction successfully added!",
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({ message: "Error adding transaction", variant: "error" });
      }
      onConfirmClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        chargeInvoiceRef.current.select();
      }, 0);
    }
  }, [open]);

  return (
    <>
      <CommonModalForm
        onSubmit={onConfirmOpen}
        title="Cashout"
        width="800px"
        disableSubmit={!isValid || !isDirty}
        {...props}
        onClose={handleClose}
      >
        <Box className="cashoutModal">
          {/* <Typography>Business Info</Typography> */}
          <TextField
            label="Business Name - Owner's Name"
            size="small"
            readOnly
            value={`${orderData?.clientId?.businessName} - ${orderData?.clientId?.ownersName}`}
            sx={{
              gridColumn: "span 2",
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
          />

          {/* <Typography>Sales Info</Typography> */}

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Amount Due (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={total}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Net of Sales (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={total}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Special Discount (%)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={10}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            suffix="%"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Special Discount Amount (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={139.75}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Discount (%)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={10 + "%"}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            suffix="%"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Discount Amount (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={139.75}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <Box></Box>

          <Controller
            name="chargeInvoiceNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Charge Invoice No."
                size="small"
                autoComplete="off"
                type="number"
                {...field}
                inputRef={chargeInvoiceRef}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                helperText={errors?.payee?.message}
                error={errors?.payee}
              />
            )}
          />
        </Box>
      </CommonModalForm>

      <CommonDialog
        open={isConfirmOpen}
        onYes={handleSubmit(onSubmit)}
        onClose={onConfirmClose}
        question
      >
        Confirm cashout of transaction?
      </CommonDialog>
    </>
  );
}

export default CashoutModal;
