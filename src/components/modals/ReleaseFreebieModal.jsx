import React, { useRef, useState } from "react";
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
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import rdfLogo from "../../assets/images/rdf-logo.png";
import {
  Attachment,
  CameraAlt,
  Close,
  PhotoCamera,
  Visibility,
} from "@mui/icons-material";
import useDisclosure from "../../hooks/useDisclosure";
import SignatureCanvasModal from "./SignatureCanvasModal";
import { useSelector } from "react-redux";
import moment from "moment";
import { usePutReleaseProspectMutation } from "../../features/prospect/api/prospectApi";
import { base64ToBlob, debounce } from "../../utils/CustomFunctions";
import SuccessSnackbar from "../SuccessSnackbar";
import ErrorSnackbar from "../ErrorSnackbar";
import CommonDialog from "../CommonDialog";

function ReleaseFreebieModal({ onRedirect, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const [signature, setSignature] = useState("");
  const [photoProof, setPhotoProof] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const freebiesLength = selectedRowData?.freebies?.length;
  const address = selectedRowData?.ownersAddress;
  const { fullname } = useSelector((state) => state.login);

  const fileUploadRef = useRef();

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
    isOpen: isRedirectListingFeeOpen,
    onOpen: onRedirectListingFeeOpen,
    onClose: onRedirectListingFeeClose,
  } = useDisclosure();

  const {
    isOpen: isListingFeeOpen,
    onOpen: onListingFeeOpen,
    onClose: onListingFeeClose,
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

  //RTK Query
  const [putReleaseProspect, { isLoading }] = usePutReleaseProspectMutation();

  //Submit API Functions
  const handleReleaseSubmit = async () => {
    const signatureFile = new File(
      [base64ToBlob(signature)],
      `signature_${Date.now()}.jpg`,
      { type: "image/jpeg" }
    );

    const formData = new FormData();
    formData.append("PhotoProof", photoProof);
    formData.append("ESignature", signatureFile);

    try {
      await putReleaseProspect({
        id: selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId,
        body: formData,
      }).unwrap();

      onClose();
      onConfirmClose();
      setSnackbarMessage("Freebie released successfully");
      // debounce(onRedirectListingFeeOpen(), 2000);
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
      onErrorOpen();
    }
  };

  //Misc Functions
  const handleCancel = () => {
    setSignature("");
    setPhotoProof(null);
    onClose();
    onCancelConfirmClose();
  };

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const renamedFile = new File([file], `proof_of_delivery_${Date.now()}`, {
        type: "image/jpeg",
      });

      setPhotoProof(renamedFile);
    }
    // setPhotoProof(file);
  };

  const handleRedirectListingFeeYes = () => {
    onRedirectListingFeeClose();
    onListingFeeOpen();
  };

  return (
    <>
      <CommonModal width="900px" {...noOnCloseProps}>
        <Box className="releaseFreebieModal">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box className="releaseFreebieModal__logo">
              <img src={rdfLogo} alt="RDF Logo" />
              <Typography>
                Purok 6, Brgy. Lara, <br /> City of San Fernando, Pampanga,
                Philippines
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton onClick={onCancelConfirmOpen}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          <Box className="releaseFreebieModal__header">
            <Typography className="releaseFreebieModal__header__title">
              Move Order Slip (Freebie)
            </Typography>
            <Box className="releaseFreebieModal__header__customerDetails">
              <Box>
                <Typography>
                  <span>Customer:</span> {selectedRowData?.businessName || ""}
                </Typography>
                <Typography>
                  <span>Address: </span>
                  {`#${address?.houseNumber || ""} ${
                    address?.streetName || ""
                  } ${address?.barangayName || ""}, ${address?.city || ""}, ${
                    address?.province || ""
                  }`}
                </Typography>
              </Box>
              <Box>
                <Typography>
                  <span>Transaction no:</span>{" "}
                  {selectedRowData?.freebies?.[freebiesLength - 1]
                    ?.transactionNumber || ""}
                </Typography>
                <Typography>
                  <span>Date:</span> {moment().format("MMM DD, YYYY")}
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
                    <TableCell>{item.itemDescription}</TableCell>
                    <TableCell>{item.uom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="releaseFreebieModal__footer">
            <Typography>
              <span>Prepared by:</span> {fullname ?? "user"}
            </Typography>
            <Box className="releaseFreebieModal__footer__attachments">
              <Box className="releaseFreebieModal__footer__attachments__signature">
                <Typography>
                  <span>Received by:</span>
                </Typography>
                <Box className="releaseFreebieModal__footer__attachments__signature__stack">
                  {signature ? (
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
                        src={signature}
                        width="70px"
                        onClick={onCanvasOpen}
                      />
                    </Box>
                  ) : (
                    <SecondaryButton onClick={onCanvasOpen}>
                      Sign here
                    </SecondaryButton>
                  )}

                  <Typography>
                    Received the above <br /> items in good condition
                  </Typography>
                </Box>
              </Box>
              <Box className="releaseFreebieModal__footer__attachments__photo">
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
                      handleViewPhoto(convertedSignature, "Signature");
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
                >
                  <Attachment />
                </IconButton>
                {/* <IconButton title="Take a picture">
                  <PhotoCamera />
                </IconButton> */}

                <Typography>
                  Upload Photo of Customer <br />
                  Receiving the Freebies
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="releaseFreebieModal__actionsEnd">
          {/* <DangerButton onClick={onCancelConfirmOpen}>Close</DangerButton> */}
          <SecondaryButton
            onClick={onConfirmOpen}
            disabled={!signature || !photoProof}
          >
            Release
          </SecondaryButton>
        </Box>
      </CommonModal>

      <SignatureCanvasModal
        open={isCanvasOpen}
        onClose={onCanvasClose}
        signature={signature}
        setSignature={setSignature}
      />

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleReleaseSubmit}
        noIcon
        isLoading={isLoading}
      >
        Confirm release freebies for{" "}
        <span style={{ fontWeight: "bold" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isCancelConfirmOpen}
        onClose={onCancelConfirmClose}
        onYes={handleCancel}
      >
        Confirm close release freebies for{" "}
        <span style={{ fontWeight: "bold" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isRedirectListingFeeOpen}
        onClose={onRedirectListingFeeClose}
        onYes={handleRedirectListingFeeYes}
      >
        Continue to listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
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

export default ReleaseFreebieModal;
