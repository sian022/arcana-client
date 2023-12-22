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
  // const [totalAmount, setTotalAmount] = useState(0);
  const totalAmount = selectedRowData?.listingFees?.reduce((total, item) => {
    return (
      total +
      item?.listingItems?.reduce((subtotal, listing) => {
        return subtotal + (listing.unitCost || 0);
      }, 0)
    );
  }, 0);

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

          {selectedRowData?.listingFees &&
          selectedRowData?.listingFees?.length > 0 ? (
            <Box className="viewListingFeeModal__table">
              <TableContainer
                sx={{
                  maxHeight: "280px",
                  overflow: "auto",
                  // width: "620px",
                  // width: "700px",
                  width: "720px",
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
                      <TableCell sx={{ color: "black !important" }}>
                        Tx No.
                      </TableCell>
                      <TableCell sx={{ color: "black !important" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedRowData?.listingFees?.map((item) =>
                      item?.listingItems?.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell>{listing.itemCode}</TableCell>
                          <TableCell>{listing.itemDescription}</TableCell>
                          <TableCell>{listing.uom}</TableCell>
                          <TableCell>{listing.sku}</TableCell>
                          <TableCell>
                            ₱ {listing.unitCost?.toLocaleString()}
                          </TableCell>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                bgcolor:
                                  item?.status === "Approved"
                                    ? "success.main"
                                    : item?.status === "Rejected"
                                    ? "error.main"
                                    : "warning.main",
                                borderRadius: "5px",
                                padding: "3px",
                                color: "white !important",
                                fontWeight: "500",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {item.status === "Under review"
                                ? "Pending"
                                : item.status || "Pending"}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  // right: "150px",
                  // right: "125px",
                  // left: "453px",
                  right: "50px",
                  bottom: "90px",
                  gap: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Total Amount
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  ₱ {totalAmount?.toLocaleString()}
                </Typography>
              </Box>
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
