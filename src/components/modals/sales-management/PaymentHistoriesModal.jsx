import {
  Alert,
  Box,
  Chip,
  Collapse,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import moment from "moment";
import {
  BlockOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { paymentTypes } from "../../../utils/Constants";
import { getIconElement } from "../../GetIconElement";
import { dummyPaymentHistoriesData } from "../../../utils/DummyData";
import {
  formatPesoAmount,
  handleCatchErrorMessage,
} from "../../../utils/CustomFunctions";
import useConfirm from "../../../hooks/useConfirm";
import useSnackbar from "../../../hooks/useSnackbar";
import { useVoidPaymentTransactionMutation } from "../../../features/sales-management/api/paymentTransactionApi";

function PaymentHistoriesModal({ ...props }) {
  const { open } = props;

  const [expandedPaymentType, setExpandedPaymentType] = useState({});
  const hasVoidable = true;

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  //RTK Query
  const [voidPaymentTransaction] = useVoidPaymentTransactionMutation();

  //Functions
  const getPaymentTypeIcon = (paymentType) => {
    return getIconElement(
      paymentTypes.find((type) => type.value === paymentType).icon,
      "gray",
      "1.3rem"
    );
  };

  const handlePaymentDropdown = (itemId, newState) => {
    setExpandedPaymentType((prevStates) => {
      // Create a new object to hold the updated states
      const updatedStates = {};

      // Loop through previous states to set all to false except the clicked one
      Object.keys(prevStates).forEach((key) => {
        updatedStates[key] = key == itemId ? newState : false;
      });

      return updatedStates;
    });
  };

  const onVoid = async (id) => {
    try {
      await confirm({
        children: "Are you sure you want to void this payment?",
        question: false,
        callback: () => voidPaymentTransaction({ id }).unwrap(),
      });

      snackbar({ message: "Payment voided successfully!", variant: "success" });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  //UseEffect
  useEffect(() => {
    if (open) {
      const initialStates = {};
      dummyPaymentHistoriesData.forEach((item) => {
        // Assuming item.id is unique for each item
        initialStates[item.id] = false; // Assuming initially all dropdowns are closed
      });
      setExpandedPaymentType(initialStates);
    } else {
      setExpandedPaymentType({});
    }
  }, [dummyPaymentHistoriesData, open]);

  return (
    <>
      <CommonModal {...props} closeTopRight height="70vh">
        <Box className="paymentHistoriesModal">
          <Typography className="paymentHistoriesModal__title">
            Payment Histories
          </Typography>

          {hasVoidable && (
            <Alert severity="warning">
              Only payments made within the past day can be voided
            </Alert>
          )}

          <Box className="paymentHistoriesModal__body">
            <Stepper
              orientation="vertical"
              sx={{
                "& .MuiStepConnector-root": {
                  flex: "none",
                  WebkitFlex: "none",
                },
              }}
            >
              {dummyPaymentHistoriesData.map((paymentTransaction) => (
                <Step key={paymentTransaction.id} active expanded>
                  <StepLabel StepIconProps={{ icon: "" }}>
                    <span style={{ fontWeight: "600", marginRight: "5px" }}>
                      {moment(paymentTransaction.date).format("MMMM D, YYYY")}
                    </span>

                    <span>
                      {moment(paymentTransaction.date).format("hh:mm a")}
                    </span>

                    {moment(paymentTransaction.date).isAfter(
                      moment().subtract(1, "days")
                    ) && (
                      <Tooltip title="Void" followCursor>
                        <IconButton
                          color="error"
                          sx={{ ml: 1, padding: 0 }}
                          onClick={() => onVoid(paymentTransaction.id)}
                        >
                          <BlockOutlined />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StepLabel>

                  <StepContent>
                    <Box className="paymentHistoriesModal__body__stepContent">
                      <Box className="paymentHistoriesModal__body__stepContent__total">
                        <Typography className="paymentHistoriesModal__body__stepContent__total__label">
                          Total:
                        </Typography>

                        <Typography className="paymentHistoriesModal__body__stepContent__total__value">
                          {formatPesoAmount(paymentTransaction.total)}
                        </Typography>
                      </Box>

                      <Box
                        className="paymentHistoriesModal__body__stepContent__paymentTypes"
                        onClick={() =>
                          handlePaymentDropdown(
                            paymentTransaction.id,
                            !expandedPaymentType[paymentTransaction.id]
                          )
                        }
                      >
                        <Typography className="paymentHistoriesModal__body__stepContent__paymentTypes__label">
                          Payment Type(s):
                        </Typography>

                        <Box className="paymentHistoriesModal__body__stepContent__paymentTypes__chips">
                          {paymentTransaction.paymentTypes.map(
                            (paymentType, index) => (
                              <Chip
                                key={index}
                                label={paymentType.paymentType}
                                variant="outlined"
                                color="primary"
                                icon={getPaymentTypeIcon(
                                  paymentType.paymentType
                                )}
                              />
                            )
                          )}
                        </Box>

                        <IconButton>
                          {expandedPaymentType[paymentTransaction.id] ? (
                            <KeyboardArrowUp color="secondary" />
                          ) : (
                            <KeyboardArrowDown color="secondary" />
                          )}
                        </IconButton>
                      </Box>

                      <Collapse in={expandedPaymentType[paymentTransaction.id]}>
                        <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed">
                          {paymentTransaction.paymentTypes.map(
                            (paymentType, index) => (
                              <Box
                                key={index}
                                className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item"
                              >
                                <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__title">
                                  <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__title__number">
                                    {index + 1}.
                                  </Typography>

                                  <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__title__label">
                                    {paymentType.paymentType}
                                  </Typography>

                                  {getPaymentTypeIcon(paymentType.paymentType)}
                                </Box>

                                <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content">
                                  <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                    <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                      Amount:
                                    </Typography>

                                    <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                      {formatPesoAmount(paymentType.amount)}
                                    </Typography>
                                  </Box>

                                  {/* Cheque Fields */}
                                  {paymentType.paymentType === "Cheque" && (
                                    <>
                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Payee:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.payee}
                                        </Typography>
                                      </Box>

                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Cheque Date:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {moment(
                                            paymentType.chequeDate
                                          ).format("MMM D, YYYY")}
                                        </Typography>
                                      </Box>

                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Bank:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.bank}
                                        </Typography>
                                      </Box>

                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Cheque Number:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.chequeNo}
                                        </Typography>
                                      </Box>

                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Date Received:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {moment(
                                            paymentType.dateReceived
                                          ).format("MMM D, YYYY")}
                                        </Typography>
                                      </Box>
                                    </>
                                  )}

                                  {/* Online Fields */}
                                  {paymentType.paymentType === "Online" && (
                                    <>
                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Account Name:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.accountName}
                                        </Typography>
                                      </Box>

                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Account Number:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.accountNumber}
                                        </Typography>
                                      </Box>

                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Reference Number:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.referenceNumber}
                                        </Typography>
                                      </Box>
                                    </>
                                  )}

                                  {/* Offset Fields */}
                                  {paymentType.paymentType === "Offset" && (
                                    <>
                                      <Box className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row">
                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                          Remarks:
                                        </Typography>

                                        <Typography className="paymentHistoriesModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                          {paymentType.remarks}
                                        </Typography>
                                      </Box>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            )
                          )}
                        </Box>
                      </Collapse>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
      </CommonModal>
    </>
  );
}

export default PaymentHistoriesModal;
