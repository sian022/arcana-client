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
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../SecondaryButton";
import ErrorSnackbar from "../ErrorSnackbar";
import useDisclosure from "../../hooks/useDisclosure";
import SuccessSnackbar from "../SuccessSnackbar";
import CommonDialog from "../CommonDialog";
import { requestListingFeeSchema } from "../../schema/schema";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import {
  useGetAllClientsForListingFeeQuery,
  useGetAllClientsQuery,
} from "../../features/registration/api/registrationApi";
import useSnackbar from "../../hooks/useSnackbar";
import {
  usePostListingFeeMutation,
  usePutUpdateListingFeeMutation,
} from "../../features/listing-fee/api/listingFeeApi";

function ListingFeeDrawer({
  editMode,
  setEditMode,
  isListingFeeOpen,
  onListingFeeClose,
  onListingFeeViewClose,
  updateListingFee,
  redirect,
}) {
  const { showSnackbar } = useSnackbar();

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

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
    name: "listingItems",
  });

  //RTK Query
  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsForListingFeeQuery({
      Status: true,
      IncludeRejected: editMode,
    });
  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery({ Status: true });

  const [postListingFee, { isLoading: isAddLoading }] =
    usePostListingFeeMutation();
  const [putListingFee, { isLoading: isUpdateLoading }] =
    usePutUpdateListingFeeMutation();

  //Drawer Functions
  const onListingFeeSubmit = async (data) => {
    if (hasDuplicateItemCodes(watch("listingItems"))) {
      setSnackbarMessage("No duplicate items allowed");
      onErrorOpen();
      onConfirmSubmitClose();
      return;
    }

    try {
      let response;

      if (editMode) {
        response = await putListingFee({
          // id: data.clientId.id,
          id: selectedRowData?.clientId,
          // freebieRequestId: data.freebieRequestId,
          params: { listingFeeId: selectedRowData?.listingFeeId },
          total: totalAmount,
          listingItems: data.listingItems.map((listingItem) => ({
            itemId: listingItem.itemId.id,
            sku: listingItem.sku,
            unitCost: listingItem.unitCost,
          })),
        });
        onListingFeeViewClose();
        setSnackbarMessage("Listing Fee updated successfully");
      } else {
        response = await postListingFee({
          clientId: data.clientId.id,
          total: totalAmount,
          listingItems: data.listingItems.map((listingItem) => ({
            itemId: listingItem.itemId.id,
            sku: listingItem.sku,
            unitCost: listingItem.unitCost,
          })),
        }).unwrap();

        setSnackbarMessage(
          `Listing Fee ${editMode ? "updated" : "added"} successfully`
        );
      }

      dispatch(setSelectedRow(response?.data));
      handleDrawerClose();
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error?.data?.messages || "Something went wrong");
      onErrorOpen();
      console.log(error);
    }

    onConfirmSubmitClose();
  };

  const handleDrawerClose = () => {
    reset();
    setValue("customerName", "");
    setEditMode(false);
    setTotalAmount(0);
    onListingFeeClose();
    onConfirmCancelClose();
  };

  //Misc Functions
  const handleListingFeeError = () => {
    if (fields.length === 1) {
      setSnackbarMessage("Must have at least 1 product");
    }
    //  else if (fields.length === 5) {
    //   setSnackbarMessage("Maximum of 5 products only");
    // }
    onErrorOpen();
  };

  const handleRemoveAll = () => {
    // Loop through the items and remove them one by one
    for (let i = fields.length - 1; i >= 0; i--) {
      remove(i);
    }
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

  const handleRecalculateTotalAmount = () => {
    let total = 0;
    watch("listingItems").forEach((item) => {
      const unitCost = parseInt(item.unitCost);
      if (!isNaN(unitCost)) {
        total += unitCost;
      }
    });

    setTotalAmount(total);
  };

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
    if (redirect && clientData) {
      const foundItem = clientData?.regularClient?.find(
        (item) => item.businessName === selectedRowData?.businessName
      );
      setValue("clientId", foundItem);
      setValue("customerName", foundItem?.ownersName);
    }
  }, [clientData]);

  useEffect(() => {
    if (editMode && isListingFeeOpen && clientData) {
      const foundItem = clientData?.regularClient?.find(
        (item) => item.id === selectedRowData?.clientId
      );

      setValue("clientId", foundItem);
      setValue("customerName", foundItem?.ownersName);
      setValue(
        "listingItems",
        selectedRowData?.listingItems.map((item) => ({
          itemId: productData?.items?.find(
            (product) => product.id === item.itemId
          ),
          itemDescription: item.itemDescription,
          uom: item.uom,
          sku: item.sku,
          unitCost: item.unitCost,
        }))
      );
      handleRecalculateTotalAmount();
    }
  }, [isListingFeeOpen, clientData]);

  return (
    <>
      <CommonDrawer
        drawerHeader={editMode ? "Update Listing Fee" : "Request Listing Fee"}
        open={isListingFeeOpen}
        onClose={onConfirmCancelOpen}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={onConfirmSubmitOpen}
        zIndex={editMode && 1300}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={clientData?.regularClient || []}
              getOptionLabel={(option) => option.businessName || ""}
              disableClearable
              loading={isClientLoading}
              disabled={redirect || editMode}
              // value={clientData?.regularClient?.find(
              //   (item) => item.businessName === selectedRowData?.businessName
              // )}
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
              onChange={(_, value) => {
                setValue(`customerName`, value?.ownersName);
                return value;
              }}
            />

            <Controller
              control={control}
              name={`customerName`}
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "310px",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                Product Information
              </Typography>
              {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
                  Remove all
                </Typography>
                <IconButton
                  sx={{ color: "error.main" }}
                  onClick={() => {
                    // fields.length <= 1
                    //   ? handleListingFeeError()
                    //   : // : remove(fields[index]);
                    remove();
                    // append({ itemId: null, unitCost: null });
                  }}
                >
                  <Cancel sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box> */}
            </Box>
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
                  name={`listingItems[${index}].itemId`}
                  control={control}
                  options={productData?.items || []}
                  getOptionLabel={(option) => option.itemCode || ""}
                  disableClearable
                  loading={isProductLoading}
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
                      `listingItems[${index}].itemDescription`,
                      value?.itemDescription
                    );
                    setValue(`listingItems[${index}].uom`, value?.uom);
                    return value;
                  }}
                />

                <Controller
                  control={control}
                  name={`listingItems[${index}].itemDescription`}
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
                  name={`listingItems[${index}].uom`}
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
                      sx={{ width: "200px" }}
                    />
                  )}
                />

                <Controller
                  key={index}
                  control={control}
                  name={`listingItems[${index}].sku`}
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
                      sx={{ width: "200px" }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`listingItems[${index}].unitCost`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="Unit Cost"
                      type="number"
                      size="small"
                      autoComplete="off"
                      onChange={(e) => {
                        onChange(e);
                        handleRecalculateTotalAmount();
                      }}
                      onBlur={onBlur}
                      value={value || ""}
                      ref={ref}
                      required
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
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
                    handleRecalculateTotalAmount();
                  }}
                >
                  <Cancel sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <SecondaryButton
            sx={{ width: "150px" }}
            onClick={() => {
              // fields.length < 5
              //   ? append({ itemId: null, unitCost: null })
              //   : handleListingFeeError();
              append({
                itemId: null,
                sku: 1,
                unitCost: null,
              });
            }}
          >
            Add Product
          </SecondaryButton>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              mr: "50px",
              position: "absolute",
              left: "600px",
              gap: "23px",
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Total Amount
            </Typography>
            <Typography sx={{ fontSize: "1rem" }}>
              {totalAmount || 0}
            </Typography>
          </Box>
        </Box>
      </CommonDrawer>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onListingFeeSubmit)}
        // isLoading={updateListingFee ? isUpdateLoading : isAddLoading}
        isLoading={editMode ? isUpdateLoading : isAddLoading}
        noIcon
      >
        Confirm {editMode ? "update" : "request"} of listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {watch("clientId.businessName")
            ? watch("clientId.businessName")
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isConfirmCancelOpen}
        onClose={onConfirmCancelClose}
        onYes={handleDrawerClose}
      >
        Are you sure you want to cancel {editMode ? "update" : "request"} of
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

export default ListingFeeDrawer;
