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
  registrationApi,
  useGetAllClientsForListingFeeQuery,
  useGetAllClientsQuery,
} from "../../features/registration/api/registrationApi";
import useSnackbar from "../../hooks/useSnackbar";
import {
  usePostListingFeeMutation,
  usePutUpdateListingFeeMutation,
} from "../../features/listing-fee/api/listingFeeApi";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NumericFormat } from "react-number-format";
import { notificationApi } from "../../features/notification/api/notificationApi";

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
  const [confirmationValue, setConfirmationValue] = useState(null);

  const [parent] = useAutoAnimate();

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

  const {
    isOpen: isClientConfirmationOpen,
    onOpen: onClientConfirmationOpen,
    onClose: onClientConfirmationClose,
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
    resolver: yupResolver(requestListingFeeSchema.schema),
    mode: "onChange",
    defaultValues: requestListingFeeSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "listingItems",
  });

  //RTK Query
  // const {
  //   data: clientData,
  //   isLoading: isClientLoading,
  //   refetch: refetchClients,
  // } = useGetAllClientsQuery({
  //   RegistrationStatus: "Approved",
  //   Status: true,
  //   PageNumber: 1,
  //   PageSize: 1000,
  //   // IncludeRejected: editMode ? editMode : "",
  // });

  const {
    data: clientData,
    isLoading: isClientLoading,
    refetch: refetchClients,
  } = useGetAllClientsForListingFeeQuery({
    Status: true,
    PageNumber: 1,
    PageSize: 1000,
    IncludeRejected: editMode ? editMode : "",
  });

  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery({ Status: true, page: 1, pageSize: 1000 });

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
        dispatch(registrationApi.util.invalidateTags(["Clients For Listing"]));
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
        dispatch(registrationApi.util.invalidateTags(["Clients For Listing"]));
      }

      dispatch(setSelectedRow(response?.data));
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
      handleDrawerClose();
      onSuccessOpen();
      // refetchClients();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${editMode ? "updating" : "adding"} listing fee`
        );
      }

      onErrorOpen();
    }

    onConfirmSubmitClose();
  };

  const handleDrawerClose = () => {
    reset();
    setValue("customerName", "");

    if (!redirect) {
      setEditMode(false);
    }
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

  const handleConfirmation = (value) => {
    // onClientConfirmationOpen();
  };

  const resetListingFee = (clientId) => {
    remove();
    append({
      itemId: null,
      sku: 1,
      unitCost: null,
    });

    setValue("clientId", clientId);
    setValue(`customerName`, clientId.ownersName);
    setTotalAmount(0);
    onClientConfirmationClose();
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
        (item) =>
          item.businessName === selectedRowData?.businessName &&
          item.ownersName === selectedRowData?.ownersName
      );
      setValue("clientId", foundItem);
      setValue("customerName", foundItem?.ownersName);
    }
  }, [isListingFeeOpen, clientData]);

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
        drawerHeader={editMode ? "Update Listing Fee" : "Add Listing Fee"}
        open={isListingFeeOpen}
        onClose={isDirty ? onConfirmCancelOpen : handleDrawerClose}
        width="1000px"
        disableSubmit={!isValid || totalAmount <= 0}
        onSubmit={onConfirmSubmitOpen}
        // zIndex={editMode && 1300}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() || ""
              }
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
                  label="Business Name - Owner's Name"
                  required
                  helperText={errors?.itemId?.message}
                  error={errors?.itemId}
                  // sx={{ width: "300px" }}
                  sx={{ width: "400px" }}
                />
              )}
              onChange={(_, value) => {
                if (watch("clientId") && watch("listingItems")[0]?.itemId) {
                  onClientConfirmationOpen();
                  setConfirmationValue(value);
                  return watch("clientId");
                } else {
                  return value;
                }
              }}
            />

            {/* <Controller
              control={control}
              name={`merchandisingAllowance`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumericFormat
                  customInput={TextField}
                  type="text"
                  // onChange={(e) => {
                  //   handleCreditLimitChange(e);
                  // }}
                  label="Merchandising Allowance (₱)"
                  // InputProps={{
                  //   startAdornment: (
                  //     <InputAdornment
                  //       position="start"
                  //       style={{ marginLeft: -3 }}
                  //     >
                  //       ₱
                  //     </InputAdornment>
                  //   ),
                  // }}
                  autoComplete="off"
                  thousandSeparator=","
                  size="small"
                  sx={{ width: "280px" }}
                />
              )}
            /> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "310px",
              overflowX: "hidden",
              overflowY: "auto",
            }}
            // ref={parent}
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
                  getOptionDisabled={(option) => {
                    const listingFees = watch("listingItems");
                    // const isListingFeeRepeating = listingFees.some(
                    //   (item) => item?.itemId?.itemCode === option.itemCode
                    // );

                    const isListingFeeRepeating = Array.isArray(listingFees)
                      ? listingFees.some(
                          (item) => item?.itemId?.itemCode === option.itemCode
                        )
                      : false;

                    const selectedClientData = watch("clientId");

                    const isListingFeeRepeatingBackend =
                      selectedClientData?.listingFees?.some((item) =>
                        item?.listingItems?.some(
                          (item) => item?.itemCode === option.itemCode
                        )
                      );

                    const isInitialValue = selectedRowData?.listingItems?.some(
                      (item) => item?.itemCode === option.itemCode
                    );

                    // const isInitialValueStillSelected =
                    //   selectedClientData?.listingFees?.some((request) =>
                    //     request?.listingItems?.some((item) =>
                    //       selectedRowData?.listingItems.some(
                    //         (initialItem) =>
                    //           initialItem?.itemCode === item.itemCode
                    //       )
                    //     )
                    //   );

                    return (
                      isListingFeeRepeating ||
                      (editMode
                        ? !isInitialValue &&
                          // !isInitialValueStillSelected &&
                          isListingFeeRepeatingBackend
                        : isListingFeeRepeatingBackend)
                    );
                  }}
                  disableClearable
                  loading={isProductLoading}
                  disabled={!watch("clientId")}
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
                      value={value?.toUpperCase() || ""}
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
                    <NumericFormat
                      label="Unit Cost"
                      type="text"
                      size="small"
                      customInput={TextField}
                      autoComplete="off"
                      onValueChange={(e) => {
                        onChange(Number(e.value));
                        handleRecalculateTotalAmount();
                      }}
                      onBlur={onBlur}
                      value={value || ""}
                      // ref={ref}
                      required
                      thousandSeparator=","
                      disabled={!watch("clientId")}
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
                  tabIndex={-1}
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
            disabled={
              !watch("listingItems")[watch("listingItems").length - 1]
                ?.itemId ||
              !watch("listingItems")[watch("listingItems").length - 1]?.unitCost
            }
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
              {totalAmount?.toLocaleString() || 0}
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
        Confirm {editMode ? "update" : "adding"} of listing fee for{" "}
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
        Are you sure you want to cancel {editMode ? "update" : "adding"} of
        listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {watch("clientId.businessName")
            ? watch("clientId.businessName")
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isClientConfirmationOpen}
        onClose={onClientConfirmationClose}
        onYes={() => resetListingFee(confirmationValue)}
      >
        Are you sure you want to change client?
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (FREEBIES WILL BE RESET)
        </span>
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
