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
import useSnackbar from "../../hooks/useSnackbar";
import SuccessButton from "../SuccessButton";
import {
  usePutApproveExpensesMutation,
  usePutRejectExpensesMutation,
} from "../../features/otherExpenses/api/otherExpensesRegApi";
import { useSendMessageMutation } from "../../features/misc/api/rdfSmsApi";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function ViewExpensesModal({ approval, expenseStatus, ...props }) {
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
    ? "You have a new other expenses approval."
    : `${selectedRowData?.businessName}'s other expenses request has been approved.`;
  const messageReceiverMessageRejected = `${selectedRowData?.businessName}'s other expenses request has been rejected.`;

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
  const [putApproveExpenses, { isLoading: isApproveLoading }] =
    usePutApproveExpensesMutation();

  const [putRejectExpenses, { isLoading: isRejectLoading }] =
    usePutRejectExpensesMutation();

  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

  const customRibbonContent = (
    // <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
    <>
      <Box className="viewExpensesModal__headers">
        <Typography className="viewExpensesModal__headers__title">
          Other Expenses
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
      await putApproveExpenses({
        id: selectedRowData?.requestId,
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameApproved}! ${messageReceiverMessageApproved}`,
        mobile_number: `+63${messageReceiverNumberApproved}`,
      }).unwrap();

      snackbar({
        message: "Other Expenses approved successfully",
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
          "Other expenses approved successfully but failed to send message.",
        variant: "warning",
      });
      onApproveConfirmClose();
      onClose();
    }
  };

  const handleReject = async () => {
    try {
      await putRejectExpenses({
        // id: selectedRowData?.approvalId,
        id: selectedRowData?.requestId,
        reason: reason,
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameRejected}! ${messageReceiverMessageRejected}`,
        mobile_number: `+63${messageReceiverNumberRejected}`,
      }).unwrap();

      snackbar({
        message: "Other Expenses rejected successfully",
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
      selectedRowData?.expenses?.map((item) => item.amount) || [];
    const total = totalCosts.reduce((acc, cost) => acc + cost, 0);

    setTotalAmount(total);
    // setTotalAmount(selectedRowData?.amount);
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
        <Box className="viewExpensesModal">
          <Box className="viewExpensesModal__customerDetails">
            <Box className="viewExpensesModal__customerDetails__left">
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white !important",
                }}
              >
                Business Name
              </Box>
              <Box>
                <TextField
                  size="small"
                  value={selectedRowData?.businessName?.toUpperCase()}
                  readOnly
                  sx={{ pointerEvents: "none" }}
                />
              </Box>
            </Box>

            <Box className="viewExpensesModal__customerDetails__right">
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white !important",
                }}
              >
                Customer Name
              </Box>
              <Box>
                <TextField
                  size="small"
                  readOnly
                  value={selectedRowData?.ownersName?.toUpperCase()}
                  sx={{ pointerEvents: "none" }}
                />
              </Box>
            </Box>
          </Box>

          <Box className="viewExpensesModal__transactionNumber">
            <Typography className="viewExpensesModal__transactionNumber__label">
              Transaction Number:
            </Typography>
            <Typography className="viewExpensesModal__transactionNumber__value">
              {selectedRowData?.id}
            </Typography>
          </Box>

          <Box className="viewExpensesModal__table">
            <TableContainer
              sx={{
                maxHeight: "300px",
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
                    {/* <TableCell>ID</TableCell> */}
                    <TableCell
                      sx={{
                        color: "black !important",
                      }}
                    >
                      Expense Type
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "black !important",
                      }}
                    >
                      Remarks
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "black !important",
                      }}
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedRowData?.expenses?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.expenseType?.toUpperCase()}</TableCell>
                      <TableCell>
                        {item.remarks?.toUpperCase() || "N/A"}{" "}
                      </TableCell>
                      <TableCell>₱ {item.amount?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            // right: "150px",
            // right: "125px",
            left: "550px",
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
        {approval && expenseStatus === "Under review" && (
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

            <SuccessButton onClick={onApproveConfirmOpen}>
              Approve
            </SuccessButton>
          </Box>
        )}
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
            Are you sure you want to approve other expenses for{" "}
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
                Are you sure you want to reject other expenses for{" "}
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

export default ViewExpensesModal;
