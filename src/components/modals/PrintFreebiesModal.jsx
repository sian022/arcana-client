import React, { useContext, useEffect, useRef, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  CircularProgress,
  IconButton,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import rdfLogo from "../../assets/images/RDF-Logo.png";

import useDisclosure from "../../hooks/useDisclosure";
import SignatureCanvasModal from "./SignatureCanvasModal";
import { useSelector } from "react-redux";
import moment from "moment";
import { usePutReleaseProspectMutation } from "../../features/prospect/api/prospectApi";
import { base64ToBlob, debounce } from "../../utils/CustomFunctions";
import SuccessSnackbar from "../SuccessSnackbar";
import ErrorSnackbar from "../ErrorSnackbar";
import CommonDialog from "../CommonDialog";
import ViewPhotoModal from "./ViewPhotoModal";
import RegisterRegularForm from "../../pages/customer-registration/prospecting/RegisterRegularForm";
import { DirectReleaseContext } from "../../context/DirectReleaseContext";
import SuccessButton from "../SuccessButton";
import { useReactToPrint } from "react-to-print";
import "../../assets/styles/print.styles.scss";

function PrintFreebiesModal({ registration, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;
  const { open, ...noOpenProps } = otherProps;

  const [signature, setSignature] = useState("");
  const [photoProof, setPhotoProof] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const freebiesLength = selectedRowData?.freebies?.length;
  const address = selectedRowData?.ownersAddress;
  const { fullname } = useSelector((state) => state.login);

  const fileUploadRef = useRef();

  const {
    signatureDirect,
    photoProofDirect,
    setSignatureDirect,
    setPhotoProofDirect,
  } = useContext(DirectReleaseContext);

  const printRef = useRef(null);

  const {
    isOpen: isCanvasOpen,
    onOpen: onCanvasOpen,
    onClose: onCanvasClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  const {
    isOpen: isViewPhotoOpen,
    onOpen: onViewPhotoOpen,
    onClose: onViewPhotoClose,
  } = useDisclosure();

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
          <SuccessButton
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
          </SuccessButton>
        </Box>
      </CommonModal>

      <SignatureCanvasModal
        open={isCanvasOpen}
        onClose={onCanvasClose}
        signature={signature}
        setSignature={setSignature}
      />

      <ViewPhotoModal
        open={isViewPhotoOpen}
        onClose={onViewPhotoClose}
        currentViewPhoto={photoProof}
        currentViewPhotoLabel={"Freebie Photo"}
      />

      <RegisterRegularForm open={isRegisterOpen} onClose={onRegisterClose} />

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handlePrint}
        noIcon
      >
        Confirm printing of freebies for{" "}
        <span style={{ fontWeight: "bold" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <SuccessSnackbar
        open={isSuccessOpen}
        onClose={onSuccessClose}
        message={snackbarMessage}
      />

      <ErrorSnackbar
        open={isErrorOpen}
        onClose={onErrorClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default PrintFreebiesModal;
