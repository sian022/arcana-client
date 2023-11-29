import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import SecondaryButton from "../../SecondaryButton";
import {
  AddAPhoto,
  Assignment,
  Business,
  CameraAlt,
  Create,
  PermIdentity,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import useDisclosure from "../../../hooks/useDisclosure";
import ViewPhotoModal from "../ViewPhotoModal";

function ListingFeeTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures

  return (
    <>
      <Box className="viewRegistrationModal__attachments">
        <Typography className="viewRegistrationModal__attachments__header">
          Requested by: {selectedRowData?.requestedBy}
        </Typography>
        <Box className="viewRegistrationModal__attachments__content">
          <Box className="viewRegistrationModal__attachments__content__titleGroup">
            <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
              Listing Fee
            </Typography>
            <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
              Product Information
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__attachments__content__fields">
            <Box className="viewRegistrationModal__attachments__content__fields__item">
              <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                Owner's Signature
              </Typography>
              <SecondaryButton
                onClick={() => {
                  const foundItem = selectedRowData?.attachments.find(
                    (item) => item.documentType.toLowerCase() === "signature"
                  );
                  handleViewPhoto(
                    foundItem?.documentLink,
                    "Representative's Signature"
                  );
                }}
                className="viewRegistrationModal__attachments__content__fields__item__value"
              >
                <Create />
              </SecondaryButton>
            </Box>

            <Box className="viewRegistrationModal__attachments__content__fields__item">
              <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                Store Photo:
              </Typography>
              <SecondaryButton
                onClick={() => {
                  const foundItem = selectedRowData?.attachments.find(
                    (item) => item.documentType.toLowerCase() === "store photo"
                  );
                  handleViewPhoto(foundItem?.documentLink, "Store Photo");
                }}
                className="viewRegistrationModal__attachments__content__fields__item__value"
              >
                <AddAPhoto />
              </SecondaryButton>
            </Box>

            <Box className="viewRegistrationModal__attachments__content__fields__item">
              <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                Business Permit:
              </Typography>
              <SecondaryButton
                onClick={() => {
                  const foundItem = selectedRowData?.attachments.find(
                    (item) =>
                      item.documentType.toLowerCase() === "business permit"
                  );
                  handleViewPhoto(foundItem?.documentLink, "Business Permit");
                }}
                className="viewRegistrationModal__attachments__content__fields__item__value"
              >
                <Business />
              </SecondaryButton>
            </Box>

            <Box className="viewRegistrationModal__attachments__content__fields__item">
              <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                Valid ID of Owner:
              </Typography>
              <SecondaryButton
                onClick={() => {
                  const foundItem = selectedRowData?.attachments.find(
                    (item) =>
                      item.documentType.toLowerCase() === "photo id owner"
                  );
                  handleViewPhoto(foundItem?.documentLink, "Valid ID of Owner");
                }}
                className="viewRegistrationModal__attachments__content__fields__item__value"
              >
                <PermIdentity />
              </SecondaryButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ListingFeeTab;
