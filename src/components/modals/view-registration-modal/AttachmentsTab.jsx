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
import {
  useGetAttachmentsByClientIdQuery,
  useGetTermsByClientIdQuery,
} from "../../../features/registration/api/registrationApi";
import AttachmentsTabSkeleton from "../../skeletons/AttachmentsTabSkeleton";
import BlankCanvas from "../../../assets/images/blank-canvas.svg";

function AttachmentsTab() {
  const [currentViewPhoto, setCurrentViewPhoto] = useState(null);
  const [currentViewPhotoLabel, setCurrentViewPhotoLabel] = useState("");

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isViewPhotoOpen,
    onOpen: onViewPhotoOpen,
    onClose: onViewPhotoClose,
  } = useDisclosure();

  //RTK Query
  const { data, error, isLoading } = useGetAttachmentsByClientIdQuery({
    id: selectedRowData?.id,
  });

  const { data: termsData } = useGetTermsByClientIdQuery({
    id: selectedRowData?.id,
  });

  const isRepresentativeRequirements = data?.attachments?.length > 4;

  const handleViewPhoto = (file, label) => {
    onViewPhotoOpen();
    setCurrentViewPhoto(file);
    setCurrentViewPhotoLabel(label);
  };

  return (
    <>
      <Box className="viewRegistrationModal__attachments">
        <Typography className="viewRegistrationModal__attachments__header">
          Requested by: {selectedRowData?.requestedBy}
        </Typography>

        {isLoading ? (
          <AttachmentsTabSkeleton />
        ) : (
          <Box className="viewRegistrationModal__attachments__content">
            <Box className="viewRegistrationModal__attachments__content__titleGroup">
              <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
                Attachments
              </Typography>

              {termsData?.termId === 1 ? (
                <Typography fontSize="1.2rem" fontWeight="500">
                  COD clients have no attachments required
                </Typography>
              ) : (
                <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
                  {isRepresentativeRequirements
                    ? "Representative's Requirements"
                    : "Owner's Requirements"}
                </Typography>
              )}
            </Box>

            {termsData?.termId === 1 ? (
              <Box className="viewRegistrationModal__attachments__content__termsCod">
                <img src={BlankCanvas} alt="no-image" width="200px" />

                <Typography className="viewRegistrationModal__attachments__content__termsCod__text">
                  No Attachments Found
                </Typography>
              </Box>
            ) : (
              <Box className="viewRegistrationModal__attachments__content__fields">
                <Box className="viewRegistrationModal__attachments__content__fields__item">
                  <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                    {isRepresentativeRequirements
                      ? "Representative's Signature:"
                      : "Owner's Signature:"}
                  </Typography>
                  <SecondaryButton
                    onClick={() => {
                      const foundItem = data?.attachments.find(
                        (item) =>
                          item.documentType.toLowerCase() === "signature"
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
                      const foundItem = data?.attachments.find(
                        (item) =>
                          item.documentType.toLowerCase() === "store photo"
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
                      const foundItem = data?.attachments.find(
                        (item) =>
                          item.documentType.toLowerCase() === "business permit"
                      );
                      handleViewPhoto(
                        foundItem?.documentLink,
                        "Business Permit"
                      );
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
                      const foundItem = data?.attachments.find(
                        (item) =>
                          item.documentType.toLowerCase() === "photo id owner"
                      );
                      handleViewPhoto(
                        foundItem?.documentLink,
                        "Valid ID of Owner"
                      );
                    }}
                    className="viewRegistrationModal__attachments__content__fields__item__value"
                  >
                    <PermIdentity />
                  </SecondaryButton>
                </Box>

                {isRepresentativeRequirements && (
                  <>
                    <Box className="viewRegistrationModal__attachments__content__fields__item">
                      <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                        Valid ID of Representative
                      </Typography>
                      <SecondaryButton
                        onClick={() => {
                          const foundItem = data?.attachments.find(
                            (item) =>
                              item.documentType.toLowerCase() ===
                              "photo id representative"
                          );
                          handleViewPhoto(
                            foundItem?.documentLink,
                            "Valid ID of Representative"
                          );
                        }}
                        className="viewRegistrationModal__attachments__content__fields__item__value"
                      >
                        <CameraAlt />
                      </SecondaryButton>
                    </Box>

                    <Box className="viewRegistrationModal__attachments__content__fields__item">
                      <Typography className="viewRegistrationModal__attachments__content__fields__item__label">
                        Authorization Letter:
                      </Typography>
                      <SecondaryButton
                        onClick={() => {
                          const foundItem = data?.attachments.find(
                            (item) =>
                              item.documentType.toLowerCase() ===
                              "authorization letter"
                          );
                          handleViewPhoto(
                            foundItem?.documentLink,
                            "Authorization Letter"
                          );
                        }}
                        className="viewRegistrationModal__attachments__content__fields__item__value"
                      >
                        <Assignment />
                      </SecondaryButton>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      <ViewPhotoModal
        open={isViewPhotoOpen}
        onClose={onViewPhotoClose}
        currentViewPhoto={currentViewPhoto}
        currentViewPhotoLabel={currentViewPhotoLabel}
        cloudified
      />
    </>
  );
}

export default AttachmentsTab;
