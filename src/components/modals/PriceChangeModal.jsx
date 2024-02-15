import React, { useEffect } from "react";
import CommonModalForm from "../CommonModalForm";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { priceModePriceChangeSchema } from "../../schema/schema";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../CommonDialog";
import {
  useLazyGetAllItemsByPriceModeIdQuery,
  usePostPriceChangeMutation,
} from "../../features/setup/api/priceModeItemsApi";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import { Cancel } from "@mui/icons-material";
import SecondaryButton from "../SecondaryButton";
import { NumericFormat } from "react-number-format";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import useSnackbar from "../../hooks/useSnackbar";

function PriceChangeModal({ ...props }) {
  const { onClose, open } = props;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const snackbar = useSnackbar();

  //Disclosures
  const {
    isOpen: isConfirmSubmitOpen,
    onOpen: onConfirmSubmitOpen,
    onClose: onConfirmSubmitClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(priceModePriceChangeSchema.schema),
    mode: "onChange",
    defaultValues: priceModePriceChangeSchema.defaultValues,
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "priceModeItemPriceChanges",
  });

  //RTK Query
  const [
    triggerProductsById,
    { data: productsByIdData, isFetching: isProductsByIdFetching },
  ] = useLazyGetAllItemsByPriceModeIdQuery();

  const [postPriceChange, { isLoading: isPriceChangeLoading }] =
    usePostPriceChangeMutation();

  //Functions
  const onSubmit = async (data) => {
    const transformedData = data.priceModeItemPriceChanges.map((item) => ({
      priceModeItemId: item.priceModeItemId.priceModeItemId,
      price: item.price,
      effectivityDate: moment(item.effectivityDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      // effectivityDate: item.effectivityDate,
    }));

    try {
      await postPriceChange({
        priceModeItemPriceChanges: transformedData,
      }).unwrap();
      onConfirmSubmitClose();
      handleFormClose();
      snackbar({
        message: "Price change submitted successfully",
        variant: "success",
      });
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({ message: "Error adding price change", variant: "error" });
      }
    }
  };

  const handleFormClose = () => {
    onClose();
    reset();
  };

  //UseEffects
  useEffect(() => {
    if (open) {
      triggerProductsById(
        {
          id: selectedRowData?.id,
          Status: true,
          PageNumber: 1,
          PageSize: 1000,
        },
        { preferCacheValue: true }
      );
    }
  }, [open]);

  return (
    <>
      <CommonModalForm
        title="Price Change"
        disableSubmit={
          watch("priceModeItemPriceChanges")?.length === 0
            ? false
            : !isValid || !isDirty
        }
        onSubmit={onConfirmSubmitOpen}
        // width="1400px"
        width="1000px"
        height="660px"
        open={open}
        onClose={handleFormClose}
      >
        <Box className="priceModeManagementModal">
          <Typography fontSize="1.1rem" fontWeight="700">
            Price Mode Info
          </Typography>

          <Box className="priceModeManagementModal__header">
            <TextField
              label="Price Mode"
              size="small"
              readOnly
              value={selectedRowData?.priceModeCode}
              sx={{ width: "140px", pointerEvents: "none" }}
            />

            <TextField
              label="Price Mode Description"
              size="small"
              readOnly
              value={selectedRowData?.priceModeDescription}
              sx={{ width: "400px", pointerEvents: "none" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Typography fontSize="1.1rem" fontWeight="700">
              Products List
            </Typography>

            <Button
              sx={{ color: "gray" }}
              onClick={() => {
                if (watch("priceModeItemPriceChanges").length > 0) {
                  onConfirmClearOpen();
                } else {
                  remove();
                }
              }}
            >
              Clear All
            </Button>
          </Box>

          <Box
            className="priceModeManagementModal__itemsPriceChange"
            ref={parent}
          >
            {fields.map((item, index) => (
              <Box
                key={item.id}
                className="priceModeManagementModal__items__item"
              >
                <ControlledAutocomplete
                  name={`priceModeItemPriceChanges[${index}].priceModeItemId`}
                  control={control}
                  options={productsByIdData?.priceModeItems || []}
                  getOptionLabel={(option) => option.itemCode || ""}
                  getOptionDisabled={(option) =>
                    watch("priceModeItemPriceChanges")?.some(
                      (item) =>
                        item?.priceModeItemId?.priceModeItemId ===
                        option.priceModeItemId
                    )
                  }
                  disableClearable
                  // filterSelectedOptions
                  loading={isProductsByIdFetching}
                  isOptionEqualToValue={(option, value) => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Product Code"
                      sx={{ width: "180px" }}
                    />
                  )}
                  onChange={(_, value) => {
                    setValue(
                      `priceModeItemPriceChanges[${index}].itemDescription`,
                      value?.itemDescription
                    );
                    setValue(
                      `priceModeItemPriceChanges[${index}].currentPrice`,
                      value?.currentPrice
                    );

                    return value;
                  }}
                />

                <Controller
                  control={control}
                  name={`priceModeItemPriceChanges[${index}].itemDescription`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Tooltip title={value?.toUpperCase() || ""} placement="top">
                      <TextField
                        label="Item Description"
                        size="small"
                        autoComplete="off"
                        disabled
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value?.toUpperCase() || ""}
                        ref={ref}
                        sx={{ width: "250px" }}
                      />
                    </Tooltip>
                  )}
                />

                <Controller
                  control={control}
                  name={`priceModeItemPriceChanges[${index}].currentPrice`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <NumericFormat
                      label="Current Price"
                      type="text"
                      size="small"
                      customInput={TextField}
                      autoComplete="off"
                      onValueChange={(e) => {
                        onChange(Number(e.value));
                      }}
                      onBlur={onBlur}
                      value={value || ""}
                      thousandSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      prefix="₱"
                      sx={{ width: "120px" }}
                      disabled
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`priceModeItemPriceChanges[${index}].price`}
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
                      // ref={ref}
                      // required
                      thousandSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      prefix="₱"
                      sx={{ width: "120px" }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`priceModeItemPriceChanges[${index}].effectivityDate`}
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
                        minDateTime={moment()}
                        timeSteps={{ minutes: 1 }}
                      />
                    </LocalizationProvider>
                  )}
                />

                <IconButton
                  sx={{ color: "error.main" }}
                  onClick={() => {
                    fields.length <= 1
                      ? snackbar({
                          message: "At least one product is required",
                          variant: "error",
                        })
                      : remove(index);
                  }}
                  tabIndex={-1}
                >
                  <Cancel sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <SecondaryButton
            sx={{ width: "150px" }}
            onClick={() =>
              append({
                priceModeId: selectedRowData?.id,
                priceModeItemId: null,
                price: null,
              })
            }
            disabled={!isValid}
          >
            Add Product
          </SecondaryButton>
        </Box>
      </CommonModalForm>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onSubmit)}
        question
        isLoading={isPriceChangeLoading}
      >
        Are you sure you want to submit price changes for{" "}
        <span style={{ fontWeight: "bold" }}>
          "{selectedRowData?.priceModeCode} -{" "}
          {selectedRowData?.priceModeDescription}"
        </span>
      </CommonDialog>
    </>
  );
}

export default PriceChangeModal;
