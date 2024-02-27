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
import React from "react";
import { useSelector } from "react-redux";
import { useGetFreebiesByClientIdQuery } from "../../../features/registration/api/registrationApi";
import FreebiesTabSkeleton from "../../skeletons/FreebiesTabSkeleton";
import NoRecordsFound from "../../../assets/images/NoRecordsFound.svg";

function FreebiesTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures

  //RTK Query
  const { data, isLoading } = useGetFreebiesByClientIdQuery({
    id: selectedRowData?.id,
  });

  return (
    <>
      <Box className="viewRegistrationModal__listingFee">
        <Box className="viewRegistrationModal__listingFee__header">
          <Typography className="viewRegistrationModal__listingFee__header__label">
            Requested by:{" "}
          </Typography>
          <Typography>{selectedRowData?.requestedBy}</Typography>
        </Box>

        {isLoading ? (
          <FreebiesTabSkeleton />
        ) : (
          <Box className="viewRegistrationModal__listingFee__content">
            <Box className="viewRegistrationModal__listingFee__content__titleGroup">
              <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                Freebies
              </Typography>
              {/* {data?.freebies &&
              data?.freebies?.length > 0 && (
                <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                  Product Information
                </Typography>
              )} */}
            </Box>

            {data?.freebies && data?.freebies?.length > 0 ? (
              <Box className="viewListingFeeModal__table">
                <TableContainer
                  sx={{
                    maxHeight: "280px",
                    overflow: "auto",
                    // width: "620px",
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
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data?.freebies?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item?.freebies?.map((freebie) => (
                            <TableRow key={freebie.id}>
                              <TableCell>{freebie.itemCode}</TableCell>
                              <TableCell>
                                {freebie.itemDescription?.toUpperCase()}
                              </TableCell>
                              <TableCell>{freebie.uom}</TableCell>
                              <TableCell>{freebie.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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

export default FreebiesTab;
