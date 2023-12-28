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
import { requestExpensesSchema } from "../../schema/schema";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import { useGetAllClientsForListingFeeQuery } from "../../features/registration/api/registrationApi";
import useSnackbar from "../../hooks/useSnackbar";
import {
  usePostListingFeeMutation,
  usePutUpdateListingFeeMutation,
} from "../../features/listing-fee/api/listingFeeApi";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NumericFormat } from "react-number-format";
import { useGetAllOtherExpensesQuery } from "../../features/setup/api/otherExpensesApi";

function OtherExpensesDrawer({
  editMode,
  setEditMode,
  isExpensesOpen,
  onExpensesClose,
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
    resolver: yupResolver(requestExpensesSchema.schema),
    mode: "onChange",
    defaultValues: requestExpensesSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
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
    useGetAllProductsQuery({ Status: true });
  const { data: expensesData, isLoading: isExpensesLoading } =
    useGetAllOtherExpensesQuery();

  const [postListingFee, { isLoading: isAddLoading }] =
    usePostListingFeeMutation();
  const [putListingFee, { isLoading: isUpdateLoading }] =
    usePutUpdateListingFeeMutation();

  //Drawer Functions
  const onExpensesSubmit = async (data) => {
    if (hasDuplicateItemCodes(watch("expenses"))) {
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
          expenses: data.expenses.map((expense) => ({
            expenseTypeId: expense.expenseTypeId.id,
            unitCost: expense.unitCost,
          })),
        });
        setSnackbarMessage("Expense updated successfully");
      } else {
        response = await postListingFee({
          clientId: data.clientId.id,
          total: totalAmount,
          expenses: data.expenses.map((expense) => ({
            expenseTypeId: expense.expenseTypeId.id,
            sku: expense.sku,
            unitCost: expense.unitCost,
          })),
        }).unwrap();

        setSnackbarMessage(
          `Other Expenses ${editMode ? "updated" : "added"} successfully`
        );
      }

      dispatch(setSelectedRow(response?.data));
      handleDrawerClose();
      onSuccessOpen();
      refetchClients();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${editMode ? "updating" : "adding"} other expenses`
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
    onExpensesClose();
    onConfirmCancelClose();
  };

  //Misc Functions
  const handleExpensesError = () => {
    if (fields.length === 1) {
      setSnackbarMessage("Must have at least 1 expense");
    }
    //  else if (fields.length === 5) {
    //   setSnackbarMessage("Maximum of 5 products only");
    // }
    onErrorOpen();
  };

  function hasDuplicateItemCodes(data) {
    const expenseTypes = new Set();

    for (const item of data) {
      const expenseType = item.expenseTypeId.expenseType;
      if (expenseTypes.has(expenseType)) {
        return true;
      }
      expenseTypes.add(expenseType);
    }

    return false;
  }

  const handleRecalculateTotalAmount = () => {
    let total = 0;
    watch("expenses").forEach((item) => {
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

  const resetExpenses = (clientId) => {
    remove();
    append({
      expenseTypeId: null,
      unitCost: null,
    });

    setValue("clientId", clientId);
    setValue(`customerName`, clientId.ownersName);
    setTotalAmount(0);
    onClientConfirmationClose();
  };

  //UseEffects

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
  }, [isExpensesOpen, clientData]);

  useEffect(() => {
    if (editMode && isExpensesOpen && clientData) {
      const foundItem = clientData?.regularClient?.find(
        (item) => item.id === selectedRowData?.clientId
      );

      setValue("clientId", foundItem);
      setValue("customerName", foundItem?.ownersName);
      setValue(
        "expenses",
        selectedRowData?.expenses.map((item) => ({
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
  }, [isExpensesOpen, clientData]);

  return (
    <>
      <CommonDrawer
        drawerHeader={editMode ? "Update Other Expenses" : "Add Other Expenses"}
        open={isExpensesOpen}
        onClose={isDirty ? onConfirmCancelOpen : handleDrawerClose}
        width="600px"
        disableSubmit={!isValid || totalAmount < 0}
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
                option.businessName + " - " + option.ownersName || ""
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
                if (watch("clientId") && watch("expenses")[0]?.itemId) {
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
                Expenses Information
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
                  name={`expenses[${index}].itemId`}
                  control={control}
                  options={expensesData?.otherExpenses || []}
                  getOptionLabel={(option) => option.expenseType || ""}
                  getOptionDisabled={(option) => {
                    const otherExpenses = watch("expenses");

                    const isExpenseRepeating = Array.isArray(otherExpenses)
                      ? otherExpenses.some(
                          (item) =>
                            item?.itemId?.expenseType === option.expenseType
                        )
                      : false;

                    // const selectedClientData = watch("clientId");

                    // const isExpenseRepeatingBackend =
                    //   selectedClientData?.listingFees?.some((item) =>
                    //     item?.expenses?.some(
                    //       (item) => item?.itemCode === option.itemCode
                    //     )
                    //   );

                    // return (
                    //   isExpenseRepeating || isExpenseRepeatingBackend
                    // );
                    return isExpenseRepeating;
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
                      label="Expense Type"
                      required
                      helperText={errors?.itemId?.message}
                      error={errors?.itemId}
                      sx={{ width: "300px" }}
                    />
                  )}
                  onChange={(_, value) => {
                    setValue(
                      `expenses[${index}].itemDescription`,
                      value?.itemDescription
                    );
                    setValue(`expenses[${index}].uom`, value?.uom);
                    return value;
                  }}
                />

                <Controller
                  control={control}
                  name={`expenses[${index}].unitCost`}
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
                      ? handleExpensesError()
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
              //   : handleExpensesError();
              append({
                itemId: null,
                sku: 1,
                unitCost: null,
              });
            }}
          >
            Add Expense
          </SecondaryButton>

          <Box
            sx={{
              display: "flex",
              gap: "10px",
              mr: "50px",
              position: "absolute",
              left: "180px",
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
        onYes={handleSubmit(onExpensesSubmit)}
        // isLoading={updateListingFee ? isUpdateLoading : isAddLoading}
        isLoading={editMode ? isUpdateLoading : isAddLoading}
        noIcon
      >
        Confirm {editMode ? "update" : "adding"} of other expenses for{" "}
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
        other expenses for{" "}
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
        onYes={() => resetExpenses(confirmationValue)}
      >
        Are you sure you want to change client?
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (EXPENSES WILL BE RESET)
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

export default OtherExpensesDrawer;
