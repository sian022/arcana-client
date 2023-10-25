import { Box, Typography } from "@mui/material";
import React from "react";
import SecondaryButton from "../../SecondaryButton";
import {
  AddAPhoto,
  Assignment,
  Business,
  CameraAlt,
  Create,
  PermIdentity,
} from "@mui/icons-material";

function AttachmentsTab() {
  return (
    <Box className="viewRegistrationModal__attachments">
      <Typography className="viewRegistrationModal__attachments__header">
        Requested by: Ernesto Soriano
      </Typography>
      <Box className="viewRegistrationModal__attachments__content">
        <Box className="viewRegistrationModal__attachments__content__titleGroup">
          <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
            Attachments
          </Typography>
          <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
            Representative's Requirements
          </Typography>
        </Box>

        <Box className="viewRegistrationModal__attachments__content__fields">
          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Representative's Signature:
            </Typography>
            <SecondaryButton className="viewRegistrationModal__attachments__content__fields__item__value">
              <Create />
            </SecondaryButton>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Store Photo:
            </Typography>
            <SecondaryButton className="viewRegistrationModal__attachments__content__fields__item__value">
              <AddAPhoto />
            </SecondaryButton>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Business Permit:
            </Typography>
            <SecondaryButton className="viewRegistrationModal__attachments__content__fields__item__value">
              <Business />
            </SecondaryButton>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Valid ID of Owner:
            </Typography>
            <SecondaryButton className="viewRegistrationModal__attachments__content__fields__item__value">
              <PermIdentity />
            </SecondaryButton>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Valid ID of Representative
            </Typography>
            <SecondaryButton className="viewRegistrationModal__attachments__content__fields__item__value">
              <CameraAlt />
            </SecondaryButton>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields__item">
            <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
              Authorization Letter:
            </Typography>
            <SecondaryButton className="viewRegistrationModal__attachments__content__fields__item__value">
              <Assignment />
            </SecondaryButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AttachmentsTab;
