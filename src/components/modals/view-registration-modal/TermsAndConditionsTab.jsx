import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function TermsAndConditionsTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <Box className="viewRegistrationModal__termsAndConditions">
      <Typography className="viewRegistrationModal__termsAndConditions__header">
        Requested by: {selectedRowData?.requestedBy}
      </Typography>
      <Box className="viewRegistrationModal__termsAndConditions__content">
        <Typography className="viewRegistrationModal__termsAndConditions__content__title">
          Terms and Conditions
        </Typography>
        <Box className="viewRegistrationModal__termsAndConditions__content__fields">
          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Freezer:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              {selectedRowData?.freezer ? "Yes" : "No"}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Type of Customer:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              {selectedRowData?.typeOfCustomer}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Direct Delivery:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              {selectedRowData?.freezer ? "Yes" : "N/A"}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Booking Coverage:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              {selectedRowData?.bookingCoverage}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Mode of Payment:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              {selectedRowData?.modeOfPayment}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Terms:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              Credit Limit (P50,000) (45 Days)
              {/* {selectedRowData?.terms?[].} */}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Discount:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              {/* Fixed (10%) */}
              {selectedRowData?.fixedDiscount &&
                `Fixed (${
                  selectedRowData?.fixedDiscount?.discountPercentage * 100
                }%)`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TermsAndConditionsTab;
