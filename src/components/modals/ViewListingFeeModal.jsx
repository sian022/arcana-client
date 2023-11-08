import React, { useEffect, useState } from "react";
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
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import AccentButton from "../AccentButton";
import CommonDialog from "../CommonDialog";
import useDisclosure from "../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import { usePutApproveListingFeeMutation } from "../../features/listing-fee/api/listingFeeApi";

function ViewListingFeeModal({
  setEditMode,
  onListingFeeDrawerOpen,
  approval,
  ...props
}) {
  const { onClose, ...noOnClose } = props;

  const [reason, setReason] = useState("");
  const [confirmReason, setConfirmReason] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

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

  const customRibbonContent = (
    // <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
    <>
      <Box className="viewListingFeeModal__headers">
        <Typography className="viewListingFeeModal__headers__title">
          Listing Fee Form
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
        id: selectedRowData?.id,
      }).unwrap();
      showSnackbar("Listing Fee approved successfully", "success");
    } catch (error) {
      showSnackbar(
        error?.data?.messages[0] || "Error approving listing fee",
        "error"
      );
    }

    onApproveConfirmClose();
    onClose();
  };

  const handleReject = () => {
    handleRejectConfirmClose();
    onClose();
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
                  value={selectedRowData?.businessName}
                  readOnly
                />
              </Box>
            </Box>

            <Box className="viewListingFeeModal__customerDetails__right">
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
                  value={selectedRowData?.clientName}
                />
              </Box>
            </Box>
          </Box>
          <Box className="viewListingFeeModal__table">
            <TableContainer
              sx={{
                maxHeight: "330px",
                overflow: "auto",
                width: "815px",
                borderRadius: "10px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Item Description</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Unit Cost</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedRowData?.listingItems?.map((item) => (
                    <TableRow>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.unitCost}</TableCell>
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
            right: "150px",
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
          <Typography sx={{ fontSize: "1rem" }}>{totalAmount}</Typography>
        </Box>
        {approval ? (
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
            <SecondaryButton onClick={onApproveConfirmOpen}>
              Approve
            </SecondaryButton>
            <DangerButton onClick={onRejectConfirmOpen}>Reject</DangerButton>
          </Box>
        ) : (
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
        )}
      </CommonModal>
      {approval && (
        <>
          <CommonDialog
            onClose={onApproveConfirmClose}
            open={isApproveConfirmOpen}
            onYes={handleApprove}
            isLoading={isApproveLoading}
            noIcon
          >
            Are you sure you want to approve listing fee for{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.businessName || "client"}
            </span>
            ?
          </CommonDialog>

          <CommonDialog
            onClose={onRejectConfirmClose}
            open={isRejectConfirmOpen}
            onYes={handleReject}
            disableYes={!confirmReason || !reason.trim()}
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
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "end", gap: "5x" }}>
                <Typography>Confirm reason</Typography>
                <Checkbox
                  checked={confirmReason}
                  onChange={(e) => {
                    setConfirmReason(e.target.checked);
                  }}
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
