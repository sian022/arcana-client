import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";

function TermsAndConditionsTabSkeleton() {
  return (
    <Box className="viewRegistrationModal__termsAndConditions__content">
      <Typography className="viewRegistrationModal__termsAndConditions__content__title">
        Terms and Conditions
      </Typography>
      <Box className="viewRegistrationModal__termsAndConditions__content__fields">
        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
            <Skeleton width="200px" sx={{ transform: "none" }} />
          </Typography>
          <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
            <Skeleton width="100px" sx={{ transform: "none" }} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default TermsAndConditionsTabSkeleton;
