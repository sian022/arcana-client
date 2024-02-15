import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../SecondaryButton";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../CommonDialog";
import { priceChangeSchema } from "../../schema/schema";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { usePostAddPriceChangeMutation } from "../../features/setup/api/priceModeItemsApi";

function PriceChangeDrawer({ editMode, open, onClose }) {
  const snackbar = useSnackbar();

  //Redux States
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
    resolver: yupResolver(priceChangeSchema.schema),
    mode: "onChange",
    defaultValues: priceChangeSchema.defaultValues,
  });

  //RTK Query
  const [postAddPriceChange, { isLoading: isAddPriceChangeLoading }] =
    usePostAddPriceChangeMutation();

  //Drawer Functions
  const onPriceChangeSubmit = async (data) => {
    try {
      await postAddPriceChange({
        priceModeItemId: selectedRowData?.priceModeItemId,
        effectivityDate: moment(data?.effectivityDate).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        price: data?.price,
      }).unwrap();
      snackbar({
        variant: "success",
        message: "Price Change added successfully",
      });
      onClose();
      reset();
      // onConfirmSubmitClose();
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ variant: "error", message: error?.data?.error?.message });
      } else {
        snackbar({ variant: "error", message: "Error adding Price Change" });
      }
    }
  };

  const handleDrawerClose = () => {
    onClose();
    reset();
  };

  //UseEffects
  useEffect(() => {
    if (open) {
      setValue("itemId", selectedRowData?.id);
    }
  }, [open]);

  return (
    <>
      <CommonDrawer
        drawerHeader={"Add Price Change"}
        open={open}
        onClose={handleDrawerClose}
        disableSubmit={!isValid || watch("price") <= 0}
        isLoading={isAddPriceChangeLoading}
        onSubmit={handleSubmit(onPriceChangeSubmit)}
      >
        <TextField
          label="Price Mode"
          size="small"
          disabled
          // value={`${selectedRowData?.priceModeCode} - ${selectedRowData?.priceModeDescription}`}
          value={selectedRowData?.priceModeCode}
        />

        <TextField
          label="Product Code"
          size="small"
          disabled
          value={selectedRowData?.itemCode}
        />

        <Tooltip placement="top" title={selectedRowData?.itemDescription}>
          <TextField
            label="Item Description"
            size="small"
            disabled
            value={selectedRowData?.itemDescription}
          />
        </Tooltip>

        <TextField
          label="Unit of Measurement"
          size="small"
          disabled
          value={selectedRowData?.uom}
        />

        <NumericFormat
          customInput={TextField}
          label="Current Price"
          size="small"
          disabled
          value={selectedRowData?.currentPrice}
          thousandSeparator=","
          prefix="₱"
        />

        <Controller
          name="effectivityDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                {...field}
                label="Price Effectivity Date"
                slotProps={{
                  textField: { size: "small" },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errors?.effectivityDate?.message}
                    error={errors?.effectivityDate}
                  />
                )}
                // minDate={moment()}
                minDateTime={moment()}
                timeSteps={{ minutes: 1 }}
              />
              {/* <DatePicker
                {...field}
                label="Price Effectivity Date"
                slotProps={{
                  textField: { size: "small", required: true },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errors?.effectivityDate?.message}
                    error={errors?.effectivityDate}
                  />
                )}
                minDate={moment()}
              /> */}
            </LocalizationProvider>
          )}
        />

        <Controller
          control={control}
          name={"price"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="New Price"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
              // required
              thousandSeparator=","
              prefix="₱"
              helperText={errors?.price?.message}
              error={errors?.price}
            />
          )}
        />
      </CommonDrawer>
    </>
  );
}

export default PriceChangeDrawer;
