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
import { useDispatch, useSelector } from "react-redux";
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
import { notificationApi } from "../../features/notification/api/notificationApi";

function ReleaseFreebieModal({ direct, onRedirect, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;
  const { open, ...noOpenProps } = otherProps;

  const [signature, setSignature] = useState("");
  const [photoProof, setPhotoProof] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const freebiesLength = selectedRowData?.freebies?.length;
  const address = selectedRowData?.ownersAddress;
  const { fullname } = useSelector((state) => state.login);

  const fileUploadRef = useRef();

  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.directFreebie.freebies
  );

  const dispatch = useDispatch();

  const {
    signatureDirect,
    photoProofDirect,
    setSignatureDirect,
    setPhotoProofDirect,
  } = useContext(DirectReleaseContext);

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
    isOpen: isRedirectRegisterOpen,
    onOpen: onRedirectRegisterOpen,
    onClose: onRedirectRegisterClose,
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
      debounce(onRedirectRegisterOpen(), 2000);
      onSuccessOpen();
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error releasing freebies");
      }

      onErrorOpen();
    }
  };

  const handleReleaseSave = () => {
    // setPhotoProofDirect(photoProof);
    // setSignatureDirect(signature);

    onClose();
    onConfirmClose();
  };

  //Misc Functions
  const handleCancel = () => {
    setSignature("");
    setPhotoProof(null);

    direct && setSignatureDirect("");
    direct && setPhotoProofDirect(null);

    onClose();
    onCancelConfirmClose();
  };

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const renamedFile = new File([file], `proof_of_delivery_${Date.now()}`, {
        type: "image/jpeg",
      });

      if (direct) {
        setPhotoProofDirect(renamedFile);
      } else {
        setPhotoProof(renamedFile);
      }
    }
    // setPhotoProof(file);
  };

  const handleRedirectRegisterYes = () => {
    onRegisterOpen();
    onRedirectRegisterClose();
  };

  // useEffect(() => {
  //   if (direct && open) {
  //     setSignature(signatureDirect);
  //     setPhotoProof(photoProofDirect);
  //   }
  // }, [open]);

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
              <IconButton
                onClick={
                  signature || photoProof ? onCancelConfirmOpen : handleCancel
                }
              >
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
                  {`${address?.houseNumber ? `#${address.houseNumber}` : ""}${
                    address?.houseNumber &&
                    (address?.streetName || address?.barangayName)
                      ? ", "
                      : ""
                  }${address?.streetName ? `${address.streetName}` : ""}${
                    address?.streetName && address?.barangayName ? ", " : ""
                  }${address?.barangayName ? `${address.barangayName}` : ""}${
                    address?.city ? `, ${address.city}` : ""
                  }${address?.province ? `, ${address.province}` : ""}`}
                </Typography>

                {/* <Typography>
                  <span>Address: </span>
                  {`#${address?.houseNumber || ""} ${
                    address?.streetName || ""
                  } ${address?.barangayName || ""}, ${address?.city || ""}, ${
                    address?.province || ""
                  }`}
                </Typography> */}
              </Box>
              <Box>
                <Typography>
                  <span>Transaction No:</span>{" "}
                  {direct
                    ? "Pending"
                    : selectedRowData?.freebies?.[freebiesLength - 1]
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
                {direct &&
                  freebiesDirect?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.itemId?.itemCode}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                    </TableRow>
                  ))}
                {!direct &&
                  selectedRowData?.freebies?.[
                    freebiesLength - 1
                  ]?.freebieItems?.map((item, i) => (
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
                  {direct ? (
                    signatureDirect ? (
                      <>
                        <Box
                          sx={{
                            width: "100px",
                            display: "flex",
                            justifyContent: "center",
                            position: "absolute",
                            top: -20,
                          }}
                        >
                          <img
                            src={signatureDirect}
                            width="70px"
                            onClick={onCanvasOpen}
                          />
                        </Box>
                        <Typography sx={{ maxWidth: "180px" }} minWidth="100px">
                          {selectedRowData?.ownersName}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <SecondaryButton
                          sx={{ minWidth: "130px" }}
                          onClick={onCanvasOpen}
                        >
                          Sign here
                        </SecondaryButton>
                        <Typography sx={{ fontSize: "0.8rem" }}>
                          Received the above <br /> items in good condition
                        </Typography>
                      </>
                    )
                  ) : signature ? (
                    <>
                      <Box
                        sx={{
                          width: "100px",
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
                      <Typography sx={{ maxWidth: "180px" }} minWidth="100px">
                        {selectedRowData?.ownersName}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <SecondaryButton
                        sx={{ minWidth: "130px" }}
                        onClick={onCanvasOpen}
                      >
                        Sign here
                      </SecondaryButton>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Received the above <br /> items in good condition
                      </Typography>
                    </>
                  )}

                  {/* {signature ? (
                    <>
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
                      <Typography sx={{ maxWidth: "180px" }} minWidth="100px">
                        {selectedRowData?.ownersName}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <SecondaryButton
                        sx={{ minWidth: "130px" }}
                        onClick={onCanvasOpen}
                      >
                        Sign here
                      </SecondaryButton>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Received the above <br /> items in good condition
                      </Typography>
                    </>
                  )} */}
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
                      onViewPhotoOpen();
                    }}
                    sx={{
                      color: "secondary.main",
                      border: "none !important",
                      bgcolor: "white !important",
                      position: "absolute",
                      right: "305px",
                      // right: signature ? "330px" : "305px",
                      bottom: "83px",
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}

                <IconButton
                  title="Upload photo"
                  className={
                    (direct && photoProofDirect) || (!direct && photoProof)
                      ? "filled"
                      : ""
                  }
                  // className={photoProof && "filled"}
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
          <SuccessButton
            onClick={onConfirmOpen}
            disabled={
              direct
                ? !signatureDirect || !photoProofDirect
                : !signature || !photoProof
            }
          >
            {direct ? "Save" : "Release"}
          </SuccessButton>
        </Box>
      </CommonModal>

      <SignatureCanvasModal
        open={isCanvasOpen}
        onClose={onCanvasClose}
        // signature={signature}
        signature={direct ? signatureDirect : signature}
        // setSignature={setSignature}
        setSignature={direct ? setSignatureDirect : setSignature}
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
        onYes={direct ? handleReleaseSave : handleReleaseSubmit}
        noIcon
        isLoading={isLoading}
      >
        Confirm {direct && "save"} release freebies for{" "}
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
        open={isRedirectRegisterOpen}
        onClose={onRedirectRegisterClose}
        onYes={handleRedirectRegisterYes}
        noIcon
      >
        Continue to register{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName
            ? selectedRowData?.businessName
            : "client"}{" "}
        </span>
        as regular client?
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
