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
import { useGetFreebiesByClientIdQuery } from "../../../features/registration/api/registrationApi";
import FreebiesTabSkeleton from "../../skeletons/FreebiesTabSkeleton";

function FreebiesTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures

  //RTK Query
  const { data, error, isLoading } = useGetFreebiesByClientIdQuery({
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
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                <img src={NoData} alt="no-data" style={{ width: "400px" }} />
                <Typography fontSize="18px" fontWeight={500}>
                  No Freebies Found
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default FreebiesTab;
