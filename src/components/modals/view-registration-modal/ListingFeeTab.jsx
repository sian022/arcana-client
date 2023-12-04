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
import NoData from "../../../assets/images/no-data.jpg";

function ListingFeeTab() {
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
              Listing Fee
            </Typography>

            {selectedRowData?.listingFee &&
              selectedRowData?.listingFee?.length > 0 && (
                <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                  Product Information
                </Typography>
              )}
          </Box>

          {selectedRowData?.listingFee &&
          selectedRowData?.listingFee?.length > 0 ? (
            <Box className="viewListingFeeModal__table">
              <TableContainer
                sx={{
                  maxHeight: "280px",
                  overflow: "auto",
                  width: "620px",
                  // maxWidth: "700px",
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
                        SKU
                      </TableCell>
                      <TableCell sx={{ color: "black !important" }}>
                        Unit Cost
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedRowData?.listingItems?.map((item) => (
                      <TableRow>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.itemDescription}</TableCell>
                        <TableCell>{item.uom}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>
                          ₱ {item.unitCost?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto",
              }}
            >
              <img src={NoData} alt="no-data" style={{ width: "400px" }} />
              <Typography fontSize="18px" fontWeight={500}>
                No Listing Fee Found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ListingFeeTab;
