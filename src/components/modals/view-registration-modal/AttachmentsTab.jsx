import { Box, Typography } from "@mui/material";
import React from "react";

function AttachmentsTab() {
  return (
    <Box className="viewRegistrationModal__attachments">
      <Typography className="viewRegistrationModal__attachments__header">
        Requested by: Ernesto Soriano
      </Typography>
      <Box className="viewRegistrationModal__attachments__content">
        <Typography className="viewRegistrationModal__attachments__content__title">
          Attachments
        </Typography>
        <Typography className="viewRegistrationModal__attachments__content__title">
          Representative's Requirements
        </Typography>
        <Box className="viewRegistrationModal__attachments__content__fields">
          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Name:
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Birthday:
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Contact Number:
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__fields__item__value">
              John Serrano Marquezzz
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Email Address:
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Owner's Address
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Business Name:
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__fields__item__value">
              John Serrano Marquez
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AttachmentsTab;
