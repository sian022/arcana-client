import { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../SecondaryButton";
import ErrorSnackbar from "../ErrorSnackbar";
import useDisclosure from "../../hooks/useDisclosure";
import SuccessSnackbar from "../SuccessSnackbar";
import CommonDialog from "../CommonDialog";
import { requestListingFeeSchema } from "../../schema/schema";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import { useGetAllClientsForListingFeeQuery } from "../../features/registration/api/registrationApi";
import {
  usePostListingFeeMutation,
  usePutUpdateListingFeeMutation,
} from "../../features/listing-fee/api/listingFeeApi";
import { NumericFormat } from "react-number-format";
import { useSendMessageMutation } from "../../features/misc/api/rdfSmsApi";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import useSnackbar from "../../hooks/useSnackbar";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function ListingFeeDrawer({
  editMode,
  setEditMode,
  isListingFeeOpen,
  onListingFeeClose,
  onListingFeeViewClose,
  listingFeeStatus,
  redirect,
}) {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [confirmationValue, setConfirmationValue] = useState(null);

  const snackbar = useSnackbar();
  const [parent] = useAutoAnimate();

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);
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
    setValue,
    reset,
    control,
    watch,
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

  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

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
          listingItems: data.listingItems?.map((listingItem) => ({
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
          listingItems: data.listingItems?.map((listingItem) => ({
            itemId: listingItem.itemId.id,
            sku: listingItem.sku,
            unitCost: listingItem.unitCost,
          })),
        }).unwrap();

        setSnackbarMessage(
          `Listing Fee ${editMode ? "updated" : "added"} successfully`
        );
      }
      dispatch(setSelectedRow(response));

      if (editMode) {
        listingFeeStatus === "Rejected" &&
          (await sendMessage({
            message: `Fresh morning ${
              selectedRowData?.currentApprover || "approver"
            }! You have a new listing fee approval.`,
            mobile_number: `+63${selectedRowData?.currentApproverNumber}`,
          }).unwrap());
      } else {
        await sendMessage({
          message: `Fresh morning ${
            response?.approver || "approver"
          }! You have a new listing fee approval.`,
          mobile_number: `+63${response?.approverMobileNumber}`,
        }).unwrap();
      }

      handleDrawerClose();
      onSuccessOpen();
    } catch (error) {
      if (error.function !== "sendMessage") {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }

      snackbar({
        message:
          "Listing fee requested successfully but failed to send message to approver.",
        variant: "warning",
      });
      handleDrawerClose();
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

  const handleRecalculateTotalAmount = useCallback(() => {
    let total = 0;
    watch("listingItems")?.forEach((item) => {
      const unitCost = parseFloat(item.unitCost);
      if (!isNaN(unitCost)) {
        total += unitCost;
      }
    });

    setTotalAmount(total);
  }, [watch]);

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
  }, [isListingFeeOpen, clientData, redirect, selectedRowData, setValue]);

  useEffect(() => {
    if (editMode && isListingFeeOpen && clientData) {
      const foundItem = clientData?.regularClient?.find(
        (item) => item.id === selectedRowData?.clientId
      );

      setValue("clientId", foundItem);
      setValue("customerName", foundItem?.ownersName);
      setValue(
        "listingItems",
        selectedRowData?.listingItems?.map((item) => ({
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
  }, [
    isListingFeeOpen,
    clientData,
    editMode,
    productData,
    selectedRowData,
    setValue,
    handleRecalculateTotalAmount,
  ]);

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
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
                Client Information
              </Typography>
            </Box>

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
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name - Owner's Name"
                  // required
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
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
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
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
            </Box>

            <Box
              sx={{
                paddingTop: "2px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                height: "270px",
                overflowX: "hidden",
                overflowY: "auto",
              }}
              ref={parent}
            >
              {fields?.map((item, index) => (
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

                      const isInitialValue =
                        selectedRowData?.listingItems?.some(
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
                    isOptionEqualToValue={() => true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Product Code"
                        // required
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
                    render={({ field: { onChange, onBlur, ref } }) => (
                      <TextField
                        label="SKU"
                        size="small"
                        autoComplete="off"
                        disabled
                        onChange={onChange}
                        onBlur={onBlur}
                        value={1}
                        ref={ref}
                        sx={{ width: "200px" }}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`listingItems[${index}].unitCost`}
                    render={({ field: { onChange, onBlur, value } }) => (
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
                        // required
                        thousandSeparator=","
                        allowNegative={false}
                        allowLeadingZeros={false}
                        prefix="₱"
                        disabled={!watch("clientId")}
                      />
                    )}
                  />

                  <IconButton
                    sx={{ color: "error.main" }}
                    onClick={() => {
                      console.log(index);
                      fields.length <= 1
                        ? handleListingFeeError()
                        : // : remove(fields[index]);
                          remove(index);
                      handleRecalculateTotalAmount();
                    }}
                    tabIndex={-1}
                  >
                    <RemoveCircleOutline sx={{ fontSize: "30px" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
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
            disabled={!isValid}
            endIcon={<Add />}
          >
            Add Product
          </SecondaryButton>

          <Box
            sx={{
              display: "flex",
              mr: "50px",
              position: "absolute",
              // left: "600px",
              right: "5px",
              // gap: "23px",
              gap: "10px",
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
              ₱
              {totalAmount?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
            </Typography>
          </Box>
        </Box>
      </CommonDrawer>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onListingFeeSubmit)}
        isLoading={
          editMode
            ? listingFeeStatus === "Rejected"
              ? isUpdateLoading || isSendMessageLoading
              : isUpdateLoading
            : isAddLoading || isSendMessageLoading
        }
        question
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
