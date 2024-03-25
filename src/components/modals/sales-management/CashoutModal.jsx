import { useEffect, useMemo, useRef } from "react";
import CommonModalForm from "../../CommonModalForm";
import { Controller, useForm } from "react-hook-form";
import { cashoutSchema } from "../../../schema/schema";
import { Box, Divider, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import useSnackbar from "../../../hooks/useSnackbar";
import useConfirm from "../../../hooks/useConfirm";
import { useCreateSalesTransactionMutation } from "../../../features/sales-management/api/salesTransactionApi";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import { NumericFormat } from "react-number-format";

function CashoutModal({ total, resetTransaction, orderData, ...props }) {
  const { onClose, open } = props;

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const chargeInvoiceRef = useRef();
  const discountRef = useRef();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    control,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(cashoutSchema.schema),
    mode: "onSubmit",
    defaultValues: cashoutSchema.defaultValues,
  });

  //Temp Constants
  const specialDiscount = 0.09;
  const discount = 0.05;

  const specialDiscountAmount = useMemo(
    () => total * specialDiscount,
    [specialDiscount, total]
  );

  const discountAmount = useMemo(
    () => (total * watch("discount")) / 100,
    [watch("discount"), watch, total]
  );

  const netSales = useMemo(
    () => total - discountAmount - specialDiscountAmount,
    [total, discountAmount, specialDiscountAmount]
  );

  const isVariableDiscount = true;

  //RTK Query
  const [createSalesTransaction] = useCreateSalesTransactionMutation();

  //Functions
  const onSubmit = async (data) => {
    const transformedOrderData = {
      clientId: orderData?.clientId?.clientId,
      items: orderData?.items?.map((item) => ({
        itemId: item?.itemId?.itemId,
        quantity: item?.quantity,
        unitPrice: item?.itemId?.currentPrice,
      })),
    };

    const combinedData = {
      ...transformedOrderData,
      ...data,
    };

    try {
      await confirm({
        children: <>Confirm cashout of transaction?</>,
        question: true,
        callback: () => createSalesTransaction(combinedData).unwrap(),
      });

      resetTransaction();
      handleClose();

      snackbar({
        message: "Transaction successfully added!",
        variant: "success",
      });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  //UseEffect
  useEffect(() => {
    if (open) {
      if (isVariableDiscount) {
        setTimeout(() => {
          discountRef.current.select();
        }, 0);
      } else {
        setTimeout(() => {
          chargeInvoiceRef.current.select();
        }, 0);
      }
    }
  }, [open, isVariableDiscount]);

  useEffect(() => {
    if (open) {
      !isVariableDiscount && setValue("discount", discount * 100);
      setValue("specialDiscount", specialDiscount * 100);
    }
  }, [open, setValue, discount, specialDiscount, isVariableDiscount]);

  return (
    <CommonModalForm
      onSubmit={handleSubmit(onSubmit)}
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
            <Typography fontWeight="500" fontSize="1.05rem">
              Business Name:
            </Typography>

            <Typography fontSize="1.05rem">
              {orderData?.clientId?.businessName}
            </Typography>
          </Box>

          <Box className="cashoutModal__businessInfo__owner">
            <Typography fontWeight="500" fontSize="1.05rem">
              Owner&apos;s Name:
            </Typography>

            <Typography fontSize="1.05rem">
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
                  {isVariableDiscount ? (
                    <Controller
                      control={control}
                      name="discount"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <NumericFormat
                          type="text"
                          size="small"
                          customInput={TextField}
                          autoComplete="off"
                          value={value || ""}
                          onValueChange={(e) => onChange(Number(e.value))}
                          onBlur={onBlur}
                          inputRef={discountRef}
                          inputProps={{
                            style: {
                              width: "60px",
                              //  padding: "0.5px 10px"
                              padding: "5px 10px",
                            },
                          }}
                          isAllowed={(values) => {
                            const { floatValue } = values;
                            // Check if the floatValue is greater than 10 and show a snackbar
                            if (floatValue != null && floatValue > 10) {
                              snackbar({
                                message: "Value should be between 1% and 10%",
                                variant: "error",
                              });
                              return false;
                            }
                            return true;
                          }}
                          thousandSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          decimalScale={2}
                          fixedDecimalScale
                          suffix="%"
                        />
                      )}
                    />
                  ) : (
                    `(${watch("discount")?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}%)`
                  )}
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
                  {`(${watch("specialDiscount")?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionsDigits: 2,
                  })}%)`}
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
  );
}

export default CashoutModal;
