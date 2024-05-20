import { useRef, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import rdfLogo from "../../assets/images/RDF-Logo.png";

import { useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import "../../assets/styles/print.styles.scss";
import SecondaryButton from "../SecondaryButton";

function PrintFreebiesModal({ ...otherProps }) {
  const [isLoading, setIsLoading] = useState(false);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const freebiesLength = selectedRowData?.freebies?.length;
  const address = selectedRowData?.ownersAddress;
  const { fullname } = useSelector((state) => state.login);

  const printRef = useRef(null);

  //Functions
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      setIsLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    onAfterPrint: () => {
      setIsLoading(false);
    },
  });

  // useEffect(() => {
  //   if (direct && open) {
  //     setSignature(signatureDirect);
  //     setPhotoProof(photoProofDirect);
  //   }
  // }, [open]);

  return (
    <>
      <CommonModal width="900px" {...otherProps} closeTopRight>
        <Box className="releaseFreebieModal" ref={printRef}>
          {selectedRowData?.freebies?.length > 0 ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box className="releaseFreebieModal__logo">
                  <img src={rdfLogo} alt="RDF Logo" />
                  <Typography>
                    Purok 6, Brgy. Lara, <br /> City of San Fernando, Pampanga,
                    Philippines
                  </Typography>
                </Box>
                {/* <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box> */}
              </Box>
              <Box className="releaseFreebieModal__header">
                <Typography className="releaseFreebieModal__header__title">
                  Move Order Slip (Freebie)
                </Typography>
                <Box className="releaseFreebieModal__header__customerDetails">
                  <Box>
                    <Typography>
                      <span>Customer:</span>{" "}
                      {selectedRowData?.businessName || ""}
                    </Typography>
                    <Typography>
                      <span>Address: </span>
                      {`${
                        address?.houseNumber ? `#${address.houseNumber}` : ""
                      }${
                        address?.houseNumber &&
                        (address?.streetName || address?.barangayName)
                          ? ", "
                          : ""
                      }${address?.streetName ? `${address.streetName}` : ""}${
                        address?.streetName && address?.barangayName ? ", " : ""
                      }${
                        address?.barangayName ? `${address.barangayName}` : ""
                      }${address?.city ? `, ${address.city}` : ""}${
                        address?.province ? `, ${address.province}` : ""
                      }`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography>
                      <span>Transaction No:</span>{" "}
                      {selectedRowData?.freebies?.[freebiesLength - 1]
                        ?.transactionNumber || "N/A"}
                    </Typography>
                    <Typography>
                      <span>Date:</span> {moment().format("MMM D, YYYY")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <TableContainer className="releaseFreebieModal__tableContainer">
                <Table>
                  <TableHead
                    sx={{
                      bgcolor: "#fff",
                    }}
                  >
                    <TableRow>
                      <TableCell>Qty</TableCell>
                      <TableCell>Product Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>UOM</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedRowData?.freebies?.[
                      freebiesLength - 1
                    ].freebieItems?.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>
                          {item.itemDescription?.toUpperCase()}
                        </TableCell>
                        <TableCell>{item.uom}</TableCell>
                      </TableRow>
                    ))}

                    {selectedRowData?.freebies?.[
                      freebiesLength - 1
                    ].freebies?.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>
                          {item.itemDescription?.toUpperCase()}
                        </TableCell>
                        <TableCell>{item.uom}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className="releaseFreebieModal__footer">
                <Box sx={{ position: "relative", flex: 1 }}>
                  <Typography>
                    <span>Prepared by:</span> {fullname ?? "user"}
                  </Typography>

                  <Typography className="disclaimer">
                    This document does not serve as an official receipt
                  </Typography>
                </Box>

                <Box className="releaseFreebieModal__footer__attachments">
                  <Box className="releaseFreebieModal__footer__attachments__signature">
                    <Typography>
                      <span>Received by:</span>
                    </Typography>
                    <Box className="releaseFreebieModal__footer__attachments__signature__stack">
                      <Box
                        sx={{
                          width: "100px",
                          // height: "20px",
                          display: "flex",
                          justifyContent: "center",
                          position: "absolute",
                          top: -20,
                        }}
                      >
                        <img
                          src={
                            selectedRowData?.freebies?.[freebiesLength - 1]
                              ?.eSignature
                          }
                          width="70px"
                          // onClick={onCanvasOpen}
                        />
                      </Box>
                      <Typography>{selectedRowData?.ownersName}</Typography>
                    </Box>
                  </Box>
                  {/* <Box className="releaseFreebieModal__footer__attachments__photo">
                <Input
                  type="file"
                  sx={{ display: "none" }}
                  inputRef={fileUploadRef}
                  inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
                  onChange={(e) => {
                    handleFileSubmit(e);
                  }}
                />

                {photoProof && (
                  <IconButton
                    className="attachments__column__content__item__viewOwner"
                    onClick={() => {
                      onViewPhotoOpen();
                    }}
                    sx={{
                      color: "secondary.main",
                      border: "none !important",
                      bgcolor: "white !important",
                      position: "absolute",
                      right: "305px",
                      bottom: "83px",
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}

                <IconButton
                  title="Upload photo"
                  className={photoProof && "filled"}
                  onClick={() => {
                    fileUploadRef.current.click();
                  }}
                  disabled
                >
                  <Attachment />
                </IconButton>
                {/* <IconButton title="Take a picture">
                  <PhotoCamera />
                </IconButton> */}
                  {/* <Typography>
                Upload Photo of Customer <br />
                Receiving the Freebies
              </Typography> */}
                  {/* </Box> */}
                </Box>
              </Box>
            </>
          ) : (
            <div>No freebies</div>
          )}
        </Box>
        <Box className="releaseFreebieModal__actionsEnd">
          {/* <DangerButton onClick={onCancelConfirmOpen}>Close</DangerButton> */}
          <SecondaryButton
            onClick={
              // onConfirmOpen
              handlePrint
            }
            disabled={isLoading}
          >
            {/* {direct ? "Save" : "Release"} */}
            {isLoading ? (
              <CircularProgress size="20px" color="white" />
            ) : (
              "Print"
            )}
          </SecondaryButton>
        </Box>
      </CommonModal>
    </>
  );
}

export default PrintFreebiesModal;
