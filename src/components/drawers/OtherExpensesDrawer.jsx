import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { Cancel } from "@mui/icons-material";
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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NumericFormat } from "react-number-format";
import { useGetAllOtherExpensesQuery } from "../../features/setup/api/otherExpensesApi";
import {
  usePostExpensesMutation,
  usePutUpdateExpensesMutation,
} from "../../features/otherExpenses/api/otherExpensesRegApi";

function OtherExpensesDrawer({
  editMode,
  setEditMode,
  isExpensesOpen,
  onExpensesClose,
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

  const { data: expensesData, isLoading: isExpensesLoading } =
    useGetAllOtherExpensesQuery({ Status: true, page: 1, pageSize: 1000 });

  const [postExpenses, { isLoading: isAddLoading }] = usePostExpensesMutation();
  const [putUpdateExpenses, { isLoading: isUpdateLoading }] =
    usePutUpdateExpensesMutation();

  console.log(getValues());
  //Drawer Functions
  const onExpensesSubmit = async (data) => {
    // if (hasDuplicateItemCodes(watch("expenses"))) {
    //   setSnackbarMessage("No duplicate expenses allowed");
    //   onErrorOpen();
    //   onConfirmSubmitClose();
    //   return;
    // }

    try {
      let response;

      if (editMode) {
        response = await putUpdateExpenses({
          id: selectedRowData?.id,
          expenses: data.expenses.map((expense) => ({
            otherExpenseId: expense.otherExpenseId.id,
            amount: expense.amount,
            id: expense.id || 0,
          })),
        });
        setSnackbarMessage("Expense updated successfully");
      } else {
        response = await postExpenses({
          clientId: data.clientId.id,
          expenses: data.expenses.map((expense) => ({
            otherExpenseId: expense.otherExpenseId.id,
            amount: expense.amount,
            // clientId: data.clientId.id,
          })),
        }).unwrap();

        setSnackbarMessage(
          `Other Expenses ${editMode ? "updated" : "added"} successfully`
        );
      }

      // dispatch(setSelectedRow(response?.data));
      handleDrawerClose();
      onSuccessOpen();
      // refetchClients();
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
    if (fields?.length === 1) {
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
      const expenseType = item.otherExpenseId?.expenseType;
      if (expenseTypes.has(expenseType)) {
        return true;
      }
      expenseTypes.add(expenseType);
    }

    return false;
  }

  const handleRecalculateTotalAmount = () => {
    let total = 0;
    watch("expenses")?.forEach((item) => {
      const amount = parseInt(item.amount);
      if (!isNaN(amount)) {
        total += amount;
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
      amount: null,
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
      setValue(
        "expenses",
        selectedRowData?.expenses?.map((item) => ({
          otherExpenseId: expensesData?.otherExpenses?.find(
            // (expense) => expense.id === item.otherExpenseId
            (expense) => expense.expenseType === item.expenseType
          ),
          amount: item.amount,
          id: item.id || 0,
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
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                  // sx={{ width: "300px" }}
                  sx={{ width: "400px" }}
                />
              )}
              onChange={(_, value) => {
                if (watch("clientId") && watch("expenses")[0]?.otherExpenseId) {
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
                  name={`expenses[${index}].otherExpenseId`}
                  control={control}
                  options={expensesData?.otherExpenses || []}
                  getOptionLabel={(option) =>
                    option.expenseType?.toUpperCase() || ""
                  }
                  getOptionDisabled={(option) => {
                    const otherExpenses = watch("expenses");

                    const isExpenseRepeating = Array.isArray(otherExpenses)
                      ? otherExpenses.some(
                          (expense) =>
                            expense?.otherExpenseId?.expenseType ===
                            option.expenseType
                        )
                      : false;

                    // const selectedClientData = watch("clientId");

                    // const isExpenseRepeatingBackend =
                    //   selectedClientData?.listingFees?.some((item) =>
                    //     item?.expenses?.some(
                    //       (item) => item?.itemCode === option.itemCode
                    //     )
                    //   );

                    // return isExpenseRepeating || isExpenseRepeatingBackend;
                    return isExpenseRepeating;
                  }}
                  disableClearable
                  loading={isExpensesLoading}
                  disabled={!watch("clientId")}
                  // isOptionEqualToValue={(option, value) => option.id === value.id}
                  isOptionEqualToValue={(option, value) => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Expense Type"
                      required
                      helperText={errors?.otherExpenseId?.message}
                      error={errors?.otherExpenseId}
                      sx={{ width: "300px" }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`expenses[${index}].amount`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <NumericFormat
                      label="Amount"
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
                    fields?.length <= 1
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
              append({
                otherExpenseId: null,
                amount: null,
              });
            }}
            disabled={
              !watch("expenses")[watch("expenses")?.length - 1]
                ?.otherExpenseId ||
              !watch("expenses")[watch("expenses")?.length - 1]?.amount
            }
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
