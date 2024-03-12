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
import React, { useMemo } from "react";

import { useSelector } from "react-redux";
import NoRecordsFound from "../../../assets/images/NoRecordsFound.svg";
import { useGetListingFeeByClientIdQuery } from "../../../features/registration/api/registrationApi";
import ListingFeeTabSkeleton from "../../skeletons/ListingFeeTabSkeleton";

function ListingFeeTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  // const [totalAmount, setTotalAmount] = useState(0);

  //Disclosures

  //RTK Query
  const { data, isLoading } = useGetListingFeeByClientIdQuery({
    id: selectedRowData?.id,
  });

  const totalAmount = useMemo(() => {
    return data?.listingFees?.reduce((total, item) => {
      return (
        total +
        item?.listingItems?.reduce((subtotal, listing) => {
          return subtotal + (listing.unitCost || 0);
        }, 0)
      );
    }, 0);
  }, [data]);

  return (
    <>
      <Box className="viewRegistrationModal__listingFee">
        <Box className="viewRegistrationModal__listingFee__header">
          <Typography className="viewRegistrationModal__listingFee__header__label">
            Requested by:{" "}
          </Typography>
          <Typography>{selectedRowData?.requestor}</Typography>
        </Box>

        {isLoading ? (
          <ListingFeeTabSkeleton />
        ) : (
          <Box className="viewRegistrationModal__listingFee__content">
            <Box className="viewRegistrationModal__listingFee__content__titleGroup">
              <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                Listing Fee
              </Typography>

              {/* {data?.listingFees &&
              data?.listingFees?.length > 0 && (
                <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                  Product Information
                </Typography>
              )} */}
            </Box>

            {data?.listingFees && data?.listingFees?.length > 0 ? (
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
                      {data?.listingFees?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item?.listingItems?.map((listing) => (
                            <TableRow key={listing.id}>
                              <TableCell>{listing.itemCode}</TableCell>
                              <TableCell>
                                {listing.itemDescription?.toUpperCase()}
                              </TableCell>
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
                                        : item?.status === "Voided"
                                        ? "gray"
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
                          ))}
                        </React.Fragment>
                      ))}
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
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  width: "300px",
                }}
              >
                <img
                  src={NoRecordsFound}
                  alt="no-data"
                  width="300px"
                  style={{ position: "relative", top: "15%" }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default ListingFeeTab;
