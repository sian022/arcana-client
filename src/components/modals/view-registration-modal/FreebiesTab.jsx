import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
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

function FreebiesTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures

  return (
    <>
      <Box className="viewRegistrationModal__listingFee">
        <Typography className="viewRegistrationModal__listingFee__header">
          Requested by: {selectedRowData?.requestedBy}
        </Typography>
        <Box className="viewRegistrationModal__listingFee__content">
          <Box className="viewRegistrationModal__listingFee__content__titleGroup">
            <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
              Freebies
            </Typography>
            <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
              Product Information
            </Typography>
          </Box>

          <Box className="viewListingFeeModal__table">
            <TableContainer
              sx={{
                maxHeight: "280px",
                overflow: "auto",
                // width: "620px",
                maxWidth: "700px",
                borderRadius: "10px",
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    bgcolor: "white !important",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ color: "black !important" }}>
                      Item Code
                    </TableCell>
                    <TableCell sx={{ color: "black !important" }}>
                      Item Description
                    </TableCell>
                    <TableCell sx={{ color: "black !important" }}>
                      UOM
                    </TableCell>
                    <TableCell sx={{ color: "black !important" }}>
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedRowData?.freebies?.map((item) => {
                    item?.freebies?.map((freebie) => (
                      <TableRow>
                        <TableCell>{freebie.itemCode}</TableCell>
                        <TableCell>{freebie.itemDescription}</TableCell>
                        <TableCell>{freebie.uom}</TableCell>
                        <TableCell>{freebie.quantity}</TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default FreebiesTab;
