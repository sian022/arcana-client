import { useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import DangerButton from "../DangerButton";
import CommonDialog from "../CommonDialog";
import useDisclosure from "../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import {
  usePutApproveListingFeeMutation,
  usePutRejectListingFeeMutation,
} from "../../features/listing-fee/api/listingFeeApi";
import useSnackbar from "../../hooks/useSnackbar";
import { useSendMessageMutation } from "../../features/misc/api/rdfSmsApi";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import SecondaryButton from "../SecondaryButton";

function ViewListingFeeModal({
  // setEditMode,
  // onListingFeeDrawerOpen,
  approval,
  listingFeeStatus,
  ...props
}) {
  const { onClose } = props;

  const [reason, setReason] = useState("");
  const [confirmReason, setConfirmReason] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const snackbar = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const messageReceiverNumberApproved =
    selectedRowData?.nextApproverMobileNumber
      ? selectedRowData?.nextApproverMobileNumber
      : selectedRowData?.requestorMobileNumber;
  const messageReceiverNumberRejected = selectedRowData?.requestorMobileNumber;

  const messageReceiverNameApproved = selectedRowData?.nextApprover
    ? selectedRowData?.nextApprover
    : selectedRowData?.requestor;
  const messageReceiverNameRejected = selectedRowData?.requestor;

  const messageReceiverMessageApproved = selectedRowData?.nextApprover
    ? "You have a new listing fee approval."
    : `${selectedRowData?.businessName}'s listing fee request has been approved.`;
  const messageReceiverMessageRejected = `${selectedRowData?.businessName}'s listing fee request has been rejected.`;

  //Disclosures
  const {
    isOpen: isApproveConfirmOpen,
    onOpen: onApproveConfirmOpen,
    onClose: onApproveConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isRejectConfirmOpen,
    onOpen: onRejectConfirmOpen,
    onClose: onRejectConfirmClose,
  } = useDisclosure();

  //RTK Query
  const [putApproveListingFee, { isLoading: isApproveLoading }] =
    usePutApproveListingFeeMutation();

  const [putRejectListingFee, { isLoading: isRejectLoading }] =
    usePutRejectListingFeeMutation();

  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

  const customRibbonContent = (
    // <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
    <>
      <Box className="viewListingFeeModal__headers">
        <Typography className="viewListingFeeModal__headers__title">
          Listing Fee
        </Typography>

        <IconButton
          sx={{
            color: "white !important",
            position: "absolute",
            right: "20px",
          }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </Box>
    </>

    // </Box>
  );

  //Functions
  const handleApprove = async () => {
    try {
      await putApproveListingFee({
        // id: selectedRowData?.listingFeeId,
        // id: selectedRowData?.approvalId,
        id: selectedRowData?.requestId,
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameApproved}! ${messageReceiverMessageApproved}`,
        mobile_number: `+63${messageReceiverNumberApproved}`,
      }).unwrap();

      snackbar({
        message: "Listing Fee approved successfully",
        variant: "success",
      });

      onApproveConfirmClose();
      onClose();
    } catch (error) {
      if (error.function !== "sendMessage") {
        return snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      snackbar({
        message:
          "Listing fee approved successfully but failed to send message.",
        variant: "warning",
      });
      onApproveConfirmClose();
      onClose();
    }
  };

  const handleReject = async () => {
    try {
      await putRejectListingFee({
        // id: selectedRowData?.approvalId,
        id: selectedRowData?.requestId,
        reason: reason,
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameRejected}! ${messageReceiverMessageRejected}`,
        mobile_number: `+63${messageReceiverNumberRejected}`,
      }).unwrap();

      snackbar({
        message: "Listing Fee rejected successfully",
        variant: "success",
      });
      handleRejectConfirmClose();
      onClose();
    } catch (error) {
      if (error.function !== "sendMessage") {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }

      snackbar({
        message:
          "Listing fee rejected successfully but failed to send message.",
        variant: "warning",
      });
      handleRejectConfirmClose();
      onClose();
    }
  };

  const handleRejectConfirmClose = () => {
    setReason("");
    setConfirmReason(false);
    onRejectConfirmClose();
  };

  useEffect(() => {
    const totalCosts =
      selectedRowData?.listingItems?.map((item) => item.unitCost) || [];
    const total = totalCosts.reduce((acc, cost) => acc + cost, 0);
    setTotalAmount(total);
  }, [selectedRowData]);

  return (
    <>
      <CommonModal
        width="900px"
        height="660px"
        disablePadding
        ribbon
        customRibbonContent={customRibbonContent}
        {...props}
      >
        <Box className="viewListingFeeModal">
          <Box className="viewListingFeeModal__customerDetails">
            <Box className="viewListingFeeModal__customerDetails__left">
              <Box className="viewListingFeeModal__customerDetails__left__boxLabel">
                Business Name
              </Box>
              <Box>
                <TextField
                  size="small"
                  value={selectedRowData?.businessName}
                  readOnly
                  sx={{ pointerEvents: "none" }}
                />
              </Box>
            </Box>

            <Box className="viewListingFeeModal__customerDetails__right">
              <Box className="viewListingFeeModal__customerDetails__left__boxLabel">
                Customer Name
              </Box>

              <Box>
                <TextField
                  size="small"
                  readOnly
                  value={selectedRowData?.clientName}
                  sx={{ pointerEvents: "none" }}
                />
              </Box>
            </Box>
          </Box>

          <Box className="viewListingFeeModal__transactionNumber">
            <Typography className="viewListingFeeModal__transactionNumber__label">
              Transaction Number:
            </Typography>

            <Typography className="viewListingFeeModal__transactionNumber__value">
              {selectedRowData?.listingFeeId}
            </Typography>
          </Box>

          <TableContainer
            sx={{
              maxHeight: "340px",
              overflow: "auto",
              width: "815px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  bgcolor: "white !important",
                  color: "black !important",
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      color: "black !important",
                    }}
                  >
                    Item Code
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black !important",
                    }}
                  >
                    Item Description
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black !important",
                    }}
                  >
                    UOM
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black !important",
                    }}
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black !important",
                    }}
                  >
                    Unit Cost
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedRowData?.listingItems?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.itemDescription?.toUpperCase()}</TableCell>
                    <TableCell>{item.uom}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      ₱
                      {item.unitCost?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            position: "absolute",
            // right: "150px",
            right: "40px",
            // left: "550px",
            bottom: "50px",
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
            ₱
            {totalAmount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
        {approval && listingFeeStatus === "Under review" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
              position: "absolute",
              bottom: "30px ",
              right: "40px",
            }}
          >
            <DangerButton contained onClick={onRejectConfirmOpen}>
              Reject
            </DangerButton>

            <SecondaryButton onClick={onApproveConfirmOpen}>
              Approve
            </SecondaryButton>
          </Box>
        )}
        {/* {!approval && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
              position: "absolute",
              bottom: "30px ",
              right: "40px",
            }}
          >
            <AccentButton
              sx={{ color: "white !important" }}
              onClick={() => {
                // onClose();
                setEditMode(true);
                onListingFeeDrawerOpen();
              }}
            >
              Edit
            </AccentButton>
          </Box>
        )} */}
      </CommonModal>
      {approval && (
        <>
          <CommonDialog
            onClose={onApproveConfirmClose}
            open={isApproveConfirmOpen}
            onYes={handleApprove}
            isLoading={isApproveLoading || isSendMessageLoading}
            question
          >
            Are you sure you want to approve listing fee for{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.businessName || "client"}
            </span>
            ?
          </CommonDialog>

          <CommonDialog
            onClose={handleRejectConfirmClose}
            open={isRejectConfirmOpen}
            onYes={handleReject}
            disableYes={!confirmReason || !reason.trim()}
            isLoading={isRejectLoading || isSendMessageLoading}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box>
                Are you sure you want to reject listing fee for{" "}
                <span
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {selectedRowData?.businessName || "client"}
                </span>
                ?
              </Box>

              <TextField
                size="small"
                label="Reason"
                autoComplete="off"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.toUpperCase());
                }}
                multiline
                rows={3}
              />

              <Box sx={{ display: "flex", justifyContent: "end", gap: "5x" }}>
                <Typography>Confirm reason</Typography>
                <Checkbox
                  checked={confirmReason}
                  onChange={(e) => {
                    setConfirmReason(e.target.checked);
                  }}
                  disabled={!reason.trim()}
                />
              </Box>
            </Box>
          </CommonDialog>
        </>
      )}
    </>
  );
}

export default ViewListingFeeModal;
