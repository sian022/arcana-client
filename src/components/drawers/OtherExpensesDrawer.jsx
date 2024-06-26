import { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";
import SecondaryButton from "../SecondaryButton";
import ErrorSnackbar from "../ErrorSnackbar";
import useDisclosure from "../../hooks/useDisclosure";
import SuccessSnackbar from "../SuccessSnackbar";
import CommonDialog from "../common/CommonDialog";
import { requestExpensesSchema } from "../../schema/schema";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { NumericFormat } from "react-number-format";
import { useGetAllOtherExpensesQuery } from "../../features/setup/api/otherExpensesApi";
import {
  usePostExpensesMutation,
  usePutUpdateExpensesMutation,
} from "../../features/otherExpenses/api/otherExpensesRegApi";
import { useSendMessageMutation } from "../../features/misc/api/rdfSmsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function OtherExpensesDrawer({
  editMode,
  setEditMode,
  isExpensesOpen,
  onExpensesClose,
  redirect,
  expenseStatus,
}) {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [confirmationValue, setConfirmationValue] = useState(null);

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const snackbar = useSnackbar();
  const [parent] = useAutoAnimate();

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
    resolver: yupResolver(requestExpensesSchema.schema),
    mode: "onChange",
    defaultValues: requestExpensesSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  //RTK Query
  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsQuery({
      PageNumber: 1,
      PageSize: 1000,
      RegistrationStatus: "Approved",
    });

  const { data: expensesData, isLoading: isExpensesLoading } =
    useGetAllOtherExpensesQuery({ Status: true, page: 1, pageSize: 1000 });

  const [postExpenses, { isLoading: isAddLoading }] = usePostExpensesMutation();
  const [putUpdateExpenses, { isLoading: isUpdateLoading }] =
    usePutUpdateExpensesMutation();

  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

  //Drawer Functions
  const onExpensesSubmit = async (data) => {
    try {
      let response;

      if (editMode) {
        response = await putUpdateExpenses({
          id: selectedRowData?.id,
          expenses: data.expenses.map((expense) => ({
            otherExpenseId: expense.otherExpenseId.id,
            remarks: expense.remarks,
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
            remarks: expense.remarks,
            amount: expense.amount,
          })),
        }).unwrap();

        setSnackbarMessage(
          `Other Expenses ${editMode ? "updated" : "added"} successfully`
        );
      }

      if (editMode) {
        expenseStatus === "Rejected" &&
          (await sendMessage({
            message: `Fresh morning ${
              selectedRowData?.currentApprover || "approver"
            }! You have a new other expenses approval.`,
            mobile_number: `+63${selectedRowData?.currentApproverNumber}`,
          }).unwrap());
      } else {
        await sendMessage({
          message: `Fresh morning ${
            response?.approver || "approver"
          }! You have a new other expenses approval.`,
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
          "Other expenses requested successfully but failed to send message to approver.",
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

  const handleRecalculateTotalAmount = useCallback(() => {
    let total = 0;
    watch("expenses")?.forEach((item) => {
      const amount = parseInt(item.amount);
      if (!isNaN(amount)) {
        total += amount;
      }
    });

    setTotalAmount(total);
  }, [watch]);

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
    if (editMode && isExpensesOpen && clientData) {
      const foundItem = clientData?.regularClient?.find(
        (item) => item.id === selectedRowData?.clientId
      );

      setValue("clientId", foundItem);
      setValue(
        "expenses",
        selectedRowData?.expenses?.map((item) => ({
          otherExpenseId: expensesData?.otherExpenses?.find(
            (expense) => expense.expenseType === item.expenseType
          ),
          remarks: item.remarks,
          amount: item.amount,
          id: item.id || 0,
        }))
      );
      handleRecalculateTotalAmount();
    }
  }, [
    isExpensesOpen,
    clientData,
    editMode,
    expensesData,
    handleRecalculateTotalAmount,
    selectedRowData,
    setValue,
  ]);

  return (
    <>
      <CommonDrawer
        drawerHeader={editMode ? "Update Other Expenses" : "Add Other Expenses"}
        open={isExpensesOpen}
        onClose={isDirty ? onConfirmCancelOpen : handleDrawerClose}
        width="1000px"
        disableSubmit={!isValid || totalAmount <= 0}
        onSubmit={onConfirmSubmitOpen}
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
                if (watch("clientId") && watch("expenses")[0]?.otherExpenseId) {
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
                Expenses Information
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
                    isOptionEqualToValue={() => true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Expense Type"
                        // required
                        helperText={errors?.otherExpenseId?.message}
                        error={errors?.otherExpenseId}
                        sx={{ width: "400px" }}
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
                        inputRef={ref}
                        thousandSeparator=","
                        allowNegative={false}
                        allowLeadingZeros={false}
                        disabled={!watch("clientId")}
                        prefix="₱"
                        sx={{ width: "180px" }}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`expenses[${index}].remarks`}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <TextField
                        label="Remarks"
                        type="text"
                        size="small"
                        autoComplete="off"
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        onBlur={onBlur}
                        value={value || ""}
                        inputRef={ref}
                        sx={{ flex: 1 }}
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
              append({
                otherExpenseId: null,
                amount: null,
              });
            }}
            disabled={!isValid}
            endIcon={<Add />}
          >
            Add Expense
          </SecondaryButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: "50px",
              position: "absolute",
              // left: "600px",
              right: "5px",
              gap: "23px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Total Amount
            </Typography>
            <Typography>
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
        onYes={handleSubmit(onExpensesSubmit)}
        isLoading={
          editMode
            ? expenseStatus === "Rejected"
              ? isUpdateLoading || isSendMessageLoading
              : isUpdateLoading
            : isAddLoading || isSendMessageLoading
        }
        question
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
