import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Box, IconButton, TextField } from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { Add, Cancel } from "@mui/icons-material";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../SecondaryButton";
import ErrorSnackbar from "../ErrorSnackbar";
import useDisclosure from "../../hooks/useDisclosure";
import SuccessSnackbar from "../SuccessSnackbar";
import CommonDialog from "../CommonDialog";
import { requestListingFeeSchema } from "../../schema/schema";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import useSnackbar from "../../hooks/useSnackbar";

function ListingFeeDrawer({
  isListingFeeOpen,
  onListingFeeClose,
  updateListingFee,
}) {
  const { showSnackbar } = useSnackbar();
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const clientId = selectedRowData?.id || selectedRowData?.clientId;
  const dispatch = useDispatch();

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
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(requestListingFeeSchema.schema),
    mode: "onChange",
    defaultValues: requestListingFeeSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "listingFeeItems",
  });

  //RTK Query
  const { data: productData } = useGetAllProductsQuery({ Status: true });

  //Drawer Functions
  // const onListingFeeSubmit = async (data) => {
  //   if (hasDuplicateItemCodes(watch("listingFeeItems"))) {
  //     setSnackbarMessage("No duplicate items allowed");
  //     onErrorOpen();
  //     onConfirmSubmitClose();
  //     return;
  //   }

  //   try {
  //     let response;

  //     if (updateListingFee) {
  //       response = await putFreebiesInformation({
  //         id: data.clientId,
  //         // freebieRequestId: data.freebieRequestId,
  //         params: { freebieId: data.freebieRequestId },
  //         freebies: data.freebies.map((freebie) => ({
  //           itemId: freebie.itemId.itemId,
  //         })),
  //       });
  //       setSnackbarMessage("Freebies updated successfully");
  //     } else {
  //       response = await postRequestFreebies({
  //         clientId: data.clientId,
  //         freebies: data.freebies.map((freebie) => ({
  //           itemId: freebie.itemId.id,
  //         })),
  //       }).unwrap();
  //       setSnackbarMessage("Freebies requested successfully");
  //     }

  //     dispatch(setSelectedRow(response?.data));
  //     handleDrawerClose();
  //     onSuccessOpen();
  //   } catch (error) {
  //     setSnackbarMessage(error?.data?.messages || "Something went wrong");
  //     onErrorOpen();
  //     console.log(error);
  //   }

  //   onConfirmSubmitClose();
  // };

  const handleDrawerClose = () => {
    reset();
    onListingFeeClose();
    onConfirmCancelClose();
  };

  //Misc Functions
  const handleListingFeeError = () => {
    if (fields.length === 1) {
      setSnackbarMessage("Must have at least 1 freebie");
    } else if (fields.length === 5) {
      setSnackbarMessage("Maximum of 5 freebies only");
    }
    onErrorOpen();
  };

  function hasDuplicateItemCodes(data) {
    const itemCodes = new Set();

    for (const item of data) {
      const itemCode = item.itemId.itemCode;
      if (itemCodes.has(itemCode)) {
        return true;
      }
      itemCodes.add(itemCode);
    }

    return false;
  }

  //UseEffects
  useEffect(() => {
    setValue("clientId", clientId);
    const freebiesLength = selectedRowData?.freebies?.length;

    if (updateListingFee && isListingFeeOpen) {
      const originalFreebies =
        selectedRowData?.freebies?.[freebiesLength - 1]?.freebieItems || [];

      const transformedFreebies = originalFreebies.map((item) => ({
        itemId: item,
        itemDescription: item.itemDescription,
        uom: item.uom,
      }));

      setValue("freebies", transformedFreebies);
      setValue(
        "freebieRequestId",
        selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId ||
          null
      );
    }

    return () => {
      setValue("clientId", null);
    };
  }, [isListingFeeOpen]);

  // useEffect(() => {
  //   onFreebieReleaseOpen();
  // }, [isListingFeeOpen]);
  return (
    <>
      <CommonDrawer
        drawerHeader={
          updateListingFee ? "Update Listing Fee" : "Request Listing Fee"
        }
        open={isListingFeeOpen}
        onClose={onConfirmCancelOpen}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={onConfirmSubmitOpen}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={productData?.items || []}
              getOptionLabel={(option) => option.itemCode || ""}
              disableClearable
              // isOptionEqualToValue={(option, value) => option.id === value.id}
              isOptionEqualToValue={(option, value) => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name"
                  required
                  helperText={errors?.itemId?.message}
                  error={errors?.itemId}
                  sx={{ width: "300px" }}
                />
              )}
            />

            <Controller
              control={control}
              name={`clientId`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  label="Customer Name"
                  size="small"
                  autoComplete="off"
                  disabled
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  ref={ref}
                  sx={{ width: "300px" }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {fields.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <ControlledAutocomplete
                  name={`listingFeeItem[${index}].itemId`}
                  control={control}
                  options={productData?.items || []}
                  getOptionLabel={(option) => option.itemCode || ""}
                  disableClearable
                  // isOptionEqualToValue={(option, value) => option.id === value.id}
                  isOptionEqualToValue={(option, value) => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Product Code"
                      required
                      helperText={errors?.itemId?.message}
                      error={errors?.itemId}
                      sx={{ width: "180px" }}
                    />
                  )}
                  onChange={(_, value) => {
                    setValue(
                      `listingFeeItem[${index}].itemDescription`,
                      value?.itemDescription
                    );
                    setValue(`listingFeeItem[${index}].uom`, value?.uom);
                    return value;
                  }}
                />

                <Controller
                  control={control}
                  name={`listingFeeItem[${index}].itemDescription`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="Item Description"
                      size="small"
                      autoComplete="off"
                      disabled
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || ""}
                      ref={ref}
                      sx={{ width: "400px" }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`listingFeeItem[${index}].uom`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="UOM"
                      size="small"
                      autoComplete="off"
                      disabled
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || ""}
                      ref={ref}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`listingFeeItem[${index}].uom`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="SKU"
                      size="small"
                      autoComplete="off"
                      disabled
                      onChange={onChange}
                      onBlur={onBlur}
                      // value={value || ""}
                      value={1}
                      ref={ref}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`listingFeeItem[${index}].uom`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="Unit Cost"
                      size="small"
                      autoComplete="off"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || ""}
                      ref={ref}
                      required
                    />
                  )}
                />

                <IconButton
                  sx={{ color: "error.main" }}
                  onClick={() => {
                    fields.length <= 1
                      ? handleListingFeeError()
                      : // : remove(fields[index]);
                        remove(index);
                  }}
                >
                  <Cancel sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <SecondaryButton
          sx={{ width: "150px" }}
          onClick={() => {
            fields.length < 5
              ? append({ itemId: null, quantity: 1 })
              : handleListingFeeError();
          }}
        >
          Add Listing Fee
        </SecondaryButton>
      </CommonDrawer>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        // onYes={handleSubmit(onListingFeeSubmit)}
        // isLoading={updateListingFee ? isUpdateLoading : isRequestLoading}
        noIcon
      >
        Confirm request of listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isConfirmCancelOpen}
        onClose={onConfirmCancelClose}
        onYes={handleDrawerClose}
      >
        Are you sure you want to cancel request of listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
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

export default ListingFeeDrawer;
