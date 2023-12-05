import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { Add, Cancel, Search } from "@mui/icons-material";
import {
  useGetAllProductsQuery,
  usePostAddPriceChangeMutation,
} from "../../features/setup/api/productsApi";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../SecondaryButton";
import ErrorSnackbar from "../ErrorSnackbar";
import useDisclosure from "../../hooks/useDisclosure";
import SuccessSnackbar from "../SuccessSnackbar";
import CommonDialog from "../CommonDialog";
import { priceChangeSchema } from "../../schema/schema";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

function PriceChangeDrawer({ editMode, open, onClose }) {
  const { showSnackbar } = useSnackbar();

  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isConfirmSubmitOpen,
    onOpen: onConfirmSubmitOpen,
    onClose: onConfirmSubmitClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmCancelOpen,
    onOpen: onConfirmCancelOpen,
    onClose: onConfirmCancelClose,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

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

  //Drawer Functions
  const [postAddPriceChange, { isLoading: isAddPriceChangeLoading }] =
    usePostAddPriceChangeMutation();

  console.log(getValues());

  const onPriceChangeSubmit = async (data) => {
    const { effectivityDate, ...noDate } = data;
    const transformedDate = moment(effectivityDate).format("YYYY-MM-DD");

    try {
      // await postAddPriceChange(data).unwrap();
      await postAddPriceChange({
        effectivityDate: transformedDate,
        ...noDate,
      }).unwrap();
      showSnackbar("Price Change added successfully", "success");
      onClose();
      reset();
      onConfirmSubmitClose();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error adding Price Change", "error");
      }
    }
  };

  const handleDrawerClose = () => {
    onClose();
    reset();
  };

  //Misc Functions

  //UseEffects
  // useEffect(() => {
  //   setValue("clientId", clientId);
  //   const freebiesLength = selectedRowData?.freebies?.length;

  //   if (updateListingFee && isListingFeeOpen) {
  //     const originalFreebies =
  //       selectedRowData?.freebies?.[freebiesLength - 1]?.freebieItems || [];

  //     const transformedFreebies = originalFreebies.map((item) => ({
  //       itemId: item,
  //       itemDescription: item.itemDescription,
  //       uom: item.uom,
  //     }));

  //     setValue("freebies", transformedFreebies);
  //     setValue(
  //       "freebieRequestId",
  //       selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId ||
  //         null
  //     );
  //   }

  //   return () => {
  //     setValue("clientId", null);
  //   };
  // }, [isListingFeeOpen]);

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
        disableSubmit={!isValid}
        onSubmit={onConfirmSubmitOpen}
        // zIndex={editMode && 1300}
      >
        <TextField
          label="Item Code"
          size="small"
          disabled
          value={selectedRowData?.itemCode}
        />

        <NumericFormat
          customInput={TextField}
          label="Current Price (₱)"
          size="small"
          disabled
          value={selectedRowData?.priceChangeHistories?.[0]?.price}
          thousandSeparator=","
        />
        <Controller
          control={control}
          name={"price"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Price Change (₱)"
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
              required
              thousandSeparator=","
              helperText={errors?.price?.message}
              error={errors?.price}
            />
          )}
        />

        <Controller
          name="effectivityDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
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
              />
            </LocalizationProvider>
          )}
        />
      </CommonDrawer>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onPriceChangeSubmit)}
        isLoading={isAddPriceChangeLoading}
        noIcon
      >
        Confirm adding of price change for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.itemCode || "item"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isConfirmCancelOpen}
        onClose={onConfirmCancelClose}
        onYes={handleDrawerClose}
      >
        Are you sure you want to cancel {editMode ? "update" : "adding"} of
        listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {watch("clientId.businessName")
            ? watch("clientId.businessName")
            : "client"}
        </span>
        ?
      </CommonDialog>

      <SuccessSnackbar
        open={isSuccessOpen}
        onClose={onSuccessClose}
        message={snackbarMessage}
      />

      <ErrorSnackbar
        open={isErrorOpen}
        onClose={onErrorClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default PriceChangeDrawer;
