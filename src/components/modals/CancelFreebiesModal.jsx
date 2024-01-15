import React, { useRef, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import DangerButton from "../DangerButton";
import useDisclosure from "../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import moment from "moment";
import { usePutRejectFreebiesMutation } from "../../features/prospect/api/prospectApi";
import SuccessSnackbar from "../SuccessSnackbar";
import ErrorSnackbar from "../ErrorSnackbar";
import CommonDialog from "../CommonDialog";
import AccentButton from "../AccentButton";

function CancelFreebiesModal({ ...otherProps }) {
  const { onClose } = otherProps;

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [reason, setReason] = useState("");

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const address = selectedRowData?.ownersAddress;
  const { fullname } = useSelector((state) => state.login);

  const {
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
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
  const [putRejectFreebies, { isLoading }] = usePutRejectFreebiesMutation();

  //Submit API Functions
  const handleCancelSubmit = async () => {
    const freebiesLength = selectedRowData?.freebies?.length;

    try {
      await putRejectFreebies(
        selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId
        // params: {
        //   freebieId:
        //     selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId,
        // },
        // reason: reason,
      ).unwrap();

      onClose();

      setSnackbarMessage("Freebies canceled successfully");
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error cancelling freebies");
      }

      onErrorOpen();
    }

    onCancelConfirmClose();
  };

  //Misc Functions
  const handleClose = () => {
    onClose();
    setReason("");
  };

  return (
    <>
      <CommonModal width="900px" closeTopRight {...otherProps}>
        <Box className="releaseFreebieModal">
          {/* <Box className="releaseFreebieModal__logo">
            <img src={rdfLogo} alt="RDF Logo" />
            <Typography>
              Purok 6, Brgy. Lara, <br /> City of San Fernando, Pampanga,
              Philippines
            </Typography>
          </Box> */}
          <Box className="releaseFreebieModal__header">
            <Typography className="releaseFreebieModal__header__title">
              Cancel Freebies Releasing
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
                  {selectedRowData?.freebies?.[0]?.transactionNumber || ""}
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
                {selectedRowData?.freebies?.[0]?.freebieItems?.map(
                  (item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="releaseFreebieModal__footerCancel">
            <Typography>
              <span>Prepared by:</span> {fullname ?? "user"}
            </Typography>
            {/* <TextField
              label="Reason"
              size="small"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value.toUpperCase());
              }}
            /> */}
          </Box>
        </Box>
        <Box className="releaseFreebieModal__actions">
          <AccentButton
            sx={{ color: "white !important" }}
            onClick={handleClose}
          >
            Close
          </AccentButton>
          <DangerButton
            onClick={onCancelConfirmOpen}
            // disabled={!reason || /^\s*$/.test(reason)}
          >
            Cancel Freebies
          </DangerButton>
        </Box>
      </CommonModal>

      <CommonDialog
        open={isCancelConfirmOpen}
        onClose={onCancelConfirmClose}
        onYes={handleCancelSubmit}
        isLoading={isLoading}
      >
        Confirm cancel freebies for{" "}
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

export default CancelFreebiesModal;
