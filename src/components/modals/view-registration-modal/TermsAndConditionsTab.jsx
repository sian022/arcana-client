import { Box, Typography } from "@mui/material";
import React from "react";

function TermsAndConditionsTab() {
  return (
    <Box className="viewRegistrationModal__termsAndConditions">
      <Typography className="viewRegistrationModal__termsAndConditions__header">
        Requested by: Ernesto Soriano
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
              Yes
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Type of Customer:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              Dealer
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Direct Delivery:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              N/A
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Booking Coverage:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              F1
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Mode of Payment:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              Cash & Online/Check
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Terms:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              Credit Limit (P50,000) (45 Days)
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
              Discount:
            </Typography>
            <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
              Fixed (10%)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TermsAndConditionsTab;
