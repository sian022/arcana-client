import { Box, Typography } from "@mui/material";
import React from "react";

function PersonalInfoTab() {
  return (
    <Box className="viewRegistrationModal__personalInfo">
      <Typography className="viewRegistrationModal__personalInfo__header">
        Requested by: Ernesto Soriano
      </Typography>
      <Box className="viewRegistrationModal__personalInfo__content">
        <Typography className="viewRegistrationModal__personalInfo__content__title">
          Customer's Information
        </Typography>
        <Box className="viewRegistrationModal__personalInfo__content__fields">
          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Name:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Birthday:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Contact Number:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquezzz
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Email Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Owner's Address
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Business Name:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Business Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Cluster:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__itemWrapped">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__label">
              Name of Authorized <br />
              Representative:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__value">
              John Serrano Marquez
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalInfoTab;
