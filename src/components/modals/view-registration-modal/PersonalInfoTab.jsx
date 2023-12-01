import { Box, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

function PersonalInfoTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const isRepresentativeRequirements = selectedRowData?.attachments?.length > 4;

  return (
    <Box className="viewRegistrationModal__personalInfo">
      <Typography className="viewRegistrationModal__personalInfo__header">
        Requested by: {selectedRowData?.requestedBy}
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
              <div>{selectedRowData?.ownersName}</div>
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Birthday:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {moment(selectedRowData?.dateOfBirth).format("MMMM DD, YYYY")}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Contact Number:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              +63{selectedRowData?.phoneNumber}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Email Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.emailAddress}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Owner's Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {`${
                selectedRowData?.ownersAddress?.houseNumber
                  ? `#${selectedRowData.ownersAddress.houseNumber} `
                  : ""
              }${
                selectedRowData?.ownersAddress?.streetName
                  ? `${selectedRowData.ownersAddress.streetName} `
                  : ""
              }${
                selectedRowData?.ownersAddress?.barangayName
                  ? `${selectedRowData.ownersAddress.barangayName}, `
                  : ""
              }${
                selectedRowData?.ownersAddress?.city
                  ? `${selectedRowData.ownersAddress.city}, `
                  : ""
              }${
                selectedRowData?.ownersAddress?.province
                  ? `${selectedRowData.ownersAddress.province}`
                  : ""
              }`}

              {/* #{selectedRowData?.ownersAddress?.houseNumber}{" "}
              {selectedRowData?.ownersAddress?.streetName}{" "}
              {selectedRowData?.ownersAddress?.barangayName},{" "}
              {selectedRowData?.ownersAddress?.city},{" "}
              {selectedRowData?.ownersAddress?.province} */}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Business Name:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.businessName}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Business Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {`${
                selectedRowData?.businessAddress?.houseNumber
                  ? `#${selectedRowData.businessAddress.houseNumber} `
                  : ""
              }${
                selectedRowData?.businessAddress?.streetName
                  ? `${selectedRowData.businessAddress.streetName} `
                  : ""
              }${
                selectedRowData?.businessAddress?.barangayName
                  ? `${selectedRowData.businessAddress.barangayName}, `
                  : ""
              }${
                selectedRowData?.businessAddress?.city
                  ? `${selectedRowData.businessAddress.city}, `
                  : ""
              }${
                selectedRowData?.businessAddress?.province
                  ? `${selectedRowData.businessAddress.province}`
                  : ""
              }`}
              {/* #{selectedRowData?.businessAddress?.houseNumber}{" "}
              {selectedRowData?.businessAddress?.streetName}{" "}
              {selectedRowData?.businessAddress?.barangayName},{" "}
              {selectedRowData?.businessAddress?.city},{" "}
              {selectedRowData?.businessAddress?.province} */}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Cluster:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.cluster}
            </Typography>
          </Box>

          {isRepresentativeRequirements && (
            <Box className="viewRegistrationModal__personalInfo__content__fields__itemWrapped">
              <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__label">
                Name of Authorized <br />
                Representative:
              </Typography>
              <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__value">
                {selectedRowData?.authorizedRepresentative}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalInfoTab;
