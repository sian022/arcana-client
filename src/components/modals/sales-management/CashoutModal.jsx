import { useEffect, useMemo, useRef } from "react";
import CommonModalForm from "../../CommonModalForm";
import { Controller, useForm } from "react-hook-form";
import { cashoutSchema } from "../../../schema/schema";
import { Box, Divider, TextField, Typography } from "@mui/material";
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

  //Temp Constants
  const specialDiscount = 0.1;
  const discount = 0.09;

  const specialDiscountAmount = useMemo(
    () => total * specialDiscount,
    [specialDiscount, total]
  );

  const discountAmount = useMemo(() => total * discount, [discount, total]);

  const netSales = useMemo(
    () => total - discountAmount - specialDiscountAmount,
    [total, discountAmount, specialDiscountAmount]
  );

  //UseEffect
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
        // width="800px"
        width="600px"
        disableSubmit={!isValid || !isDirty}
        {...props}
        onClose={handleClose}
      >
        <Box className="cashoutModal">
          <Box className="cashoutModal__businessInfo">
            <Box className="cashoutModal__businessInfo__business">
              <Typography fontWeight="500" fontSize="1.1rem">
                Business Name:
              </Typography>

              <Typography fontSize="1.1rem">
                {orderData?.clientId?.businessName}
              </Typography>
            </Box>

            <Box className="cashoutModal__businessInfo__owner">
              <Typography fontWeight="500" fontSize="1.1rem">
                Owner&apos;s Name:
              </Typography>

              <Typography fontSize="1.1rem">
                {orderData?.clientId?.ownersName}
              </Typography>
            </Box>

            {/* {`${orderData?.clientId?.businessName} - ${orderData?.clientId?.ownersName}`} */}
          </Box>

          <Box className="cashoutModal__transactionInfo">
            <Typography className="cashoutModal__transactionInfo__title">
              Sales Amount
            </Typography>

            <Box className="cashoutModal__transactionInfo__costBreakdown">
              <Box className="cashoutModal__transactionInfo__costBreakdown__item">
                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__label">
                  Amount Due
                </Typography>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                  ₱
                  {total?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionsDigits: 2,
                  })}
                </Typography>
              </Box>

              <Box className="cashoutModal__transactionInfo__costBreakdown__item">
                <Box className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount">
                  <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__label">
                    Discount
                  </Typography>

                  <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__value">
                    (
                    {(discount * 100)?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}
                    %)
                  </Typography>
                </Box>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                  {!discountAmount
                    ? "N/A"
                    : `-₱${discountAmount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionsDigits: 2,
                      })}`}
                </Typography>
              </Box>

              <Box className="cashoutModal__transactionInfo__costBreakdown__item">
                <Box className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount">
                  <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__label">
                    Special Discount
                  </Typography>

                  <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__value">
                    (
                    {(specialDiscount * 100)?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}
                    %)
                  </Typography>
                </Box>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                  {!specialDiscountAmount
                    ? "N/A"
                    : `-₱${specialDiscountAmount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionsDigits: 2,
                      })}`}
                </Typography>
              </Box>

              <Divider sx={{ my: "10px" }} />

              <Box className="cashoutModal__transactionInfo__costBreakdown__net">
                <Typography className="cashoutModal__transactionInfo__costBreakdown__net__label">
                  Net of Sales
                </Typography>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__net__value">
                  ₱
                  {netSales?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionsDigits: 2,
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="cashoutModal__input">
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
        </Box>

        {/* <Box className="cashoutModal">
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
            value={total?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
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
            value={netSales?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
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
            value={(specialDiscount * 100)?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
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
            value={specialDiscountAmount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
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
            value={(discount * 100)?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
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
            value={discountAmount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
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
        </Box> */}
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
