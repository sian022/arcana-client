import {
  Box,
  Collapse,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import moment from "moment";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";

function PaymentHistoriesModal({ ...props }) {
  const [expandedPaymentType, setExpandedPaymentType] = useState(false);

  return (
    <CommonModal {...props} closeTopRight height="70vh">
      <Box className="paymentHistoriesModal">
        <Typography className="paymentHistoriesModal__title">
          Payment Histories
        </Typography>

        <Box className="paymentHistoriesModal__body">
          <Stepper orientation="vertical">
            <Step active expanded>
              <StepLabel StepIconProps={{ icon: "" }}>
                <span style={{ fontWeight: "600", marginRight: "5px" }}>
                  {moment("2024-03-10T10:00:33").format("MMMM D, YYYY")}
                </span>

                <span>{moment("2024-03-10T10:00:33").format("H:mm a")}</span>
              </StepLabel>

              <StepContent>
                <Box className="paymentHistoriesModal__body__stepContent">
                  <Box className="paymentHistoriesModal__body__total">
                    <Typography className="paymentHistoriesModal__body__total__label">
                      Total:
                    </Typography>

                    <Typography className="paymentHistoriesModal__body__total__value">
                      ₱200,000.00
                    </Typography>
                  </Box>

                  <Box
                    className="paymentHistoriesModal__body__paymentTypes"
                    onClick={() => setExpandedPaymentType((prev) => !prev)}
                  >
                    <Typography className="paymentHistoriesModal__body__paymentTypes__label">
                      Payment Type(s):
                    </Typography>

                    <Typography className="paymentHistoriesModal__body__paymentTypes__value">
                      Cash, Online
                    </Typography>

                    <IconButton>
                      {expandedPaymentType ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedPaymentType}>
                    <Box className="paymentHistoriesModal__body__paymentsDetailed">
                      <Box className="paymentHistoriesModal__body__paymentsDetailed__item">
                        <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__title">
                          Cash
                        </Typography>

                        <Box className="paymentHistoriesModal__body__paymentsDetailed__item__content">
                          <Box className="paymentHistoriesModal__body__paymentsDetailed__item__content__row">
                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__label">
                              Amount:
                            </Typography>

                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__value">
                              ₱20,000.00
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box className="paymentHistoriesModal__body__paymentsDetailed__item">
                        <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__title">
                          Online
                        </Typography>

                        <Box className="paymentHistoriesModal__body__paymentsDetailed__item__content">
                          <Box className="paymentHistoriesModal__body__paymentsDetailed__item__content__row">
                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__label">
                              Amount:
                            </Typography>

                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__value">
                              ₱20,000.00
                            </Typography>
                          </Box>

                          <Box className="paymentHistoriesModal__body__paymentsDetailed__item__content__row">
                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__label">
                              Account Number:
                            </Typography>

                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__value">
                              09984461402
                            </Typography>
                          </Box>

                          <Box className="paymentHistoriesModal__body__paymentsDetailed__item__content__row">
                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__label">
                              Reference Number:
                            </Typography>

                            <Typography className="paymentHistoriesModal__body__paymentsDetailed__item__content__row__value">
                              10000239292
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </StepContent>
            </Step>

            <Step active expanded>
              <StepLabel StepIconProps={{ icon: "" }}>
                <span style={{ fontWeight: "600", marginRight: "5px" }}>
                  {moment("2024-03-10T10:00:33").format("MMMM D, YYYY")}
                </span>

                <span>{moment("2024-03-10T10:00:33").format("H:mm a")}</span>
              </StepLabel>
            </Step>

            <Step active expanded>
              <StepLabel StepIconProps={{ icon: "" }}>
                <span style={{ fontWeight: "600", marginRight: "5px" }}>
                  {moment("2024-03-10T10:00:33").format("MMMM D, YYYY")}
                </span>

                <span>{moment("2024-03-10T10:00:33").format("H:mm a")}</span>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default PaymentHistoriesModal;
