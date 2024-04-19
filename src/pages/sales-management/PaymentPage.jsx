import {
  Add,
  EditOutlined,
  KeyboardDoubleArrowLeft,
  Payment,
  Receipt,
  RemoveCircleOutline,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SecondaryButton from "../../components/SecondaryButton";
import useDisclosure from "../../hooks/useDisclosure";
import { dummyPaymentData } from "../../utils/DummyData";
import PaymentModalForm from "../../components/modals/sales-management/PaymentModalForm";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentTransactionSchema } from "../../schema/schema";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import { getIconElement } from "../../components/GetIconElement";
import {
  useCreatePaymentTransactionMutation,
  useLazyGetAllSalesTransactionForPaymentsQuery,
} from "../../features/sales-management/api/paymentTransactionApi";
import PaymentListSkeleton from "../../components/skeletons/PaymentListSkeleton";
import PaymentHistoriesModal from "../../components/modals/sales-management/PaymentHistoriesModal";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function PaymentPage({ setPaymentMode }) {
  const [client, setClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({});

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const checkboxRef = useRef(null);
  const [parent] = useAutoAnimate();

  // Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

  const {
    isOpen: isPaymentHistoriesOpen,
    onOpen: onPaymentHistoriesOpen,
    onClose: onPaymentHistoriesClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(paymentTransactionSchema.schema),
    mode: "onChange",
    defaultValues: paymentTransactionSchema.defaultValues,
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
    update: updatePayment,
  } = useFieldArray({
    control,
    name: "payments",
  });

  //Watch Constants
  const watchTransactionIds = watch("transactionId");

  //RTK Query
  const [
    triggerTransactions,
    { data: transactionsData, isFetching: isTransactionsFetching },
  ] = useLazyGetAllSalesTransactionForPaymentsQuery();

  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageNumber: 1,
      PageSize: 1000,
    });

  const [createPaymentTransaction] = useCreatePaymentTransactionMutation();

  //Functions
  const onSubmit = async (data) => {
    try {
      await confirm({
        children: "Are you sure you want to submit payment transaction?",
        question: true,
        callback: () =>
          createPaymentTransaction({
            ...data,
            totalAmountReceived: handleTotal,
          }).unwrap(),
      });

      handleReset();
      snackbar({
        message: "Payment Transaction submitted successfully",
        type: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), type: "error" });
      }
    }
  };

  //Constants
  const isAllChecked =
    watch("transactionId")?.length === dummyPaymentData.length;
  const isAllIndeterminate =
    watch("transactionId")?.length > 0 &&
    watch("transactionId")?.length !== dummyPaymentData.length;

  //Functions
  const handleReset = useCallback(async () => {
    reset();
    checkboxRef.current.checked = false;
  }, [reset]);

  const handleBack = async () => {
    try {
      if (watch("payments").length > 0) {
        await confirm({
          children:
            "Are you sure you want to go back? All unsaved changes will be lost.",
          question: true,
          callback: () => setPaymentMode(false),
        });
      } else {
        setPaymentMode(false);
      }
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), type: "error" });
      }
    }
  };

  const handleAddOpen = () => {
    setEditMode(false);
    onModalFormOpen();
  };

  const handleEditOpen = () => {
    setEditMode(true);
    onModalFormOpen();
  };

  const handleTransactionClick = (transactionId) => {
    const currentTransactionIds = watch("transactionId") || [];
    const transactionIndex = currentTransactionIds.indexOf(transactionId);

    if (transactionIndex === -1) {
      // If not already selected, add it to the array
      setValue("transactionId", [...currentTransactionIds, transactionId]);
    } else {
      // If already selected, remove it from the array
      setValue(
        "transactionId",
        currentTransactionIds.filter((id) => id !== transactionId)
      );
    }
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;

    const allTransactionIds = dummyPaymentData.map(
      (transaction) => transaction.transactionNo
    );

    if (checked) {
      // If checkbox is checked, select all transaction IDs
      setValue("transactionId", allTransactionIds);
    } else {
      // If checkbox is unchecked, deselect all transaction IDs
      setValue("transactionId", []);
    }
  };

  const handleTotal = useMemo(() => {
    const total = dummyPaymentData.reduce(
      (acc, transaction) =>
        acc +
        (watchTransactionIds?.includes(transaction.transactionNo)
          ? transaction.amount
          : 0),
      0
    );

    return total;
  }, [watchTransactionIds]);

  const handlePaymentTotal = useMemo(() => {
    const total = paymentFields.reduce(
      (acc, payment) => acc + payment.paymentAmount,
      0
    );

    return total;
  }, [paymentFields]);

  const handleRemainingBalance = useMemo(() => {
    let remainingBalance = 0;

    if (handleTotal) {
      remainingBalance = handleTotal;
    }

    if (handleTotal && handlePaymentTotal) {
      remainingBalance = handleTotal - handlePaymentTotal;
    }

    // if (remainingBalance < 0) {
    //   return 0;
    // }

    return remainingBalance;
  }, [handleTotal, handlePaymentTotal]);

  //UseEffect
  useEffect(() => {
    if (client) {
      triggerTransactions({ clientId: client?.id });
      handleReset();
    }
  }, [client, triggerTransactions, handleReset]);

  console.log(transactionsData, "transactionsData");

  return (
    <>
      <Box className="paymentPage">
        <Box className="paymentPage__header">
          <Box className="paymentPage__header__left">
            <IconButton onClick={handleBack}>
              <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
            </IconButton>

            <Typography className="paymentPage__header__left__title">
              Payment Transaction
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="paymentPage__filters">
          <Tooltip
            followCursor
            title={
              watch("payments").length > 0
                ? "Finish/clear payments first before changing clients"
                : ""
            }
          >
            <Autocomplete
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() || ""
              }
              disabled={watch("payments").length > 0}
              loading={isClientFetching}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name - Owner's Name"
                />
              )}
              value={client}
              onChange={(_, value) => setClient(value)}
              sx={{ width: "40%" }}
            />
          </Tooltip>

          <Tooltip followCursor title={!client ? "Select client first" : ""}>
            <span>
              <Button
                variant="outlined"
                endIcon={<Receipt />}
                color="secondary"
                disabled={!client}
                onClick={onPaymentHistoriesOpen}
              >
                Client Payment Histories
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Box className="paymentPage__body">
          <Box
            className={`paymentPage__body__transactions ${
              watch("payments")?.length > 0 ? " paymentTransactionOverlay" : ""
            }`}
          >
            {!client ? (
              <Typography className="paymentPage__body__transactions__selectClientFirst">
                Select client first
              </Typography>
            ) : isTransactionsFetching ? (
              <PaymentListSkeleton />
            ) : (
              <>
                <Box className="paymentPage__body__transactions__header">
                  <Button
                    className="paymentPage__body__transactions__header__checkAll"
                    onClick={() => {
                      if (isAllChecked) {
                        checkboxRef.current.checked = false;
                      } else {
                        checkboxRef.current.checked =
                          !checkboxRef.current.checked;
                      }

                      handleSelectAll({
                        target: { checked: checkboxRef.current.checked },
                      });
                    }}
                  >
                    <Checkbox
                      ref={checkboxRef}
                      onChange={handleSelectAll}
                      checked={isAllChecked}
                      indeterminate={isAllIndeterminate}
                    />

                    <Typography className="paymentPage__body__transactions__checkAll__label">
                      Select All
                    </Typography>
                  </Button>

                  <Box className="paymentPage__body__transactions__header__totalAmount">
                    <Typography className="paymentPage__body__transactions__header__totalAmount__label">
                      Total Amount:
                    </Typography>

                    <Typography className="paymentPage__body__transactions__header__totalAmount__value">
                      ₱
                      {handleTotal?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionsDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box className="paymentPage__body__transactions__transactionsList">
                  {dummyPaymentData.map((item) => (
                    <Box
                      key={item.transactionNo}
                      className="paymentPage__body__transactions__transactionsList__item"
                      onClick={() => handleTransactionClick(item.transactionNo)}
                      sx={{
                        bgcolor: watch("transactionId")?.includes(
                          item.transactionNo
                        )
                          ? "primary.light"
                          : "inherit",
                      }}
                    >
                      <Typography className="paymentPage__body__transactions__transactionsList__item__date">
                        {item.date}
                      </Typography>

                      <Box className="paymentPage__body__transactions__transactionsList__item__identifiers">
                        <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber">
                          <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber__label">
                            Transaction Number:
                          </Box>

                          <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber__value">
                            {item.transactionNo}
                          </Box>
                        </Box>

                        <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber">
                          <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber__label">
                            Invoice Number:
                          </Typography>

                          <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber__value">
                            {item.chargeInvoiceNo}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider variant="inset" />

                      <Box className="paymentPage__body__transactions__transactionsList__item__numbers">
                        <Box className="paymentPage__body__transactions__transactionsList__item__numbers__discount">
                          <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__discount__label">
                            Discount:
                          </Typography>

                          <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__discount__value">
                            10.00%
                          </Typography>
                        </Box>

                        <Box className="paymentPage__body__transactions__transactionsList__item__numbers__amount">
                          <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__amount__label">
                            Amount:
                          </Typography>

                          <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__amount__value">
                            ₱
                            {item.amount?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionsDigits: 2,
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>

          <Box className="paymentPage__body__payments">
            <Box className="paymentPage__body__payments__header">
              <Typography className="paymentPage__body__payments__header__title">
                Payments List
              </Typography>

              <SecondaryButton
                onClick={handleAddOpen}
                endIcon={<Add />}
                sx={{ width: "140px" }}
                disabled={handleRemainingBalance <= 0}
              >
                Add Payment
              </SecondaryButton>
            </Box>

            <Divider />

            <Box
              className="paymentPage__body__payments__paymentsList"
              ref={parent}
            >
              {paymentFields?.map((payment, index) => (
                <Box
                  key={payment.id}
                  className="paymentPage__body__payments__paymentsList__item"
                  onClick={() => setSelectedPayment({ index, ...payment })}
                >
                  <Box className="paymentPage__body__payments__paymentsList__item__info">
                    <Box className="paymentPage__body__payments__paymentsList__item__info__paymentType">
                      <Typography className="paymentPage__body__payments__paymentsList__item__info__paymentType__label">
                        {payment.paymentMethod.label}
                      </Typography>

                      {getIconElement(
                        payment.paymentMethod.icon,
                        "gray",
                        "1.1rem"
                      )}
                    </Box>

                    <Typography className="paymentPage__body__payments__paymentsList__item__info__amount">
                      ₱
                      {payment.paymentAmount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionsDigits: 2,
                      })}
                    </Typography>
                  </Box>

                  <Box className="paymentPage__body__payments__paymentsList__item__actions">
                    <Tooltip title="Edit">
                      <IconButton onClick={handleEditOpen}>
                        <EditOutlined color="primary" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove">
                      <IconButton onClick={() => removePayment(index)}>
                        <RemoveCircleOutline color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Box className="paymentPage__body__payments__footer">
              <Box className="paymentPage__body__payments__footer__paymentsInfo">
                <Box className="paymentPage__body__payments__footer__paymentsInfo__paymentTotal">
                  <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentTotal__label">
                    Payment Total:
                  </Typography>

                  <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentTotal__value">
                    ₱
                    {handlePaymentTotal?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Box className="paymentPage__body__payments__footer__paymentsInfo__paymentBalance">
                  <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentBalance__label">
                    Remaining Balance:
                  </Typography>

                  <Typography
                    className={
                      "paymentPage__body__payments__footer__paymentsInfo__paymentBalance__value" +
                      (handleRemainingBalance < 0
                        ? "Advance"
                        : handleRemainingBalance === 0
                        ? "Zero"
                        : "Balance")
                    }
                  >
                    ₱
                    {handleRemainingBalance?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentBalanceNote">
                  (Negative balance will go to advance payment)
                </Typography>
              </Box>

              <SecondaryButton
                size="medium"
                endIcon={<Payment />}
                onClick={handleSubmit(onSubmit)}
                disabled={paymentFields.length === 0 || !isValid || !isDirty}
              >
                Pay Now
              </SecondaryButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <PaymentModalForm
        open={isModalFormOpen}
        onClose={onModalFormClose}
        editMode={editMode}
        appendPayment={appendPayment}
        updatePayment={updatePayment}
        selectedPayment={selectedPayment}
      />

      <PaymentHistoriesModal
        open={isPaymentHistoriesOpen}
        onClose={onPaymentHistoriesClose}
      />
    </>
  );
}

export default PaymentPage;
