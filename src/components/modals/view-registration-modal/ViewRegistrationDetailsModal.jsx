import { useEffect, useState } from "react";
import CommonModal from "../../CommonModal";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import PersonalInfoTab from "./PersonalInfoTab";
import TermsAndConditionsTab from "./TermsAndConditionsTab";
import AttachmentsTab from "./AttachmentsTab";
import DangerButton from "../../DangerButton";
import useDisclosure from "../../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import CommonDialog from "../../CommonDialog";
import { Close } from "@mui/icons-material";
import {
  useLazyGetListingFeeByClientIdQuery,
  useLazyGetOtherExpensesByClientIdQuery,
  usePutApproveClientMutation,
  usePutRejectClientMutation,
} from "../../../features/registration/api/registrationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import ListingFeeTab from "./ListingFeeTab";
import FreebiesTab from "./FreebiesTab";
import OtherExpensesTab from "./OtherExpensesTab";
import { useSendMessageMutation } from "../../../features/misc/api/rdfSmsApi";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import SecondaryButton from "../../SecondaryButton";

function ViewRegistrationDetailsModal({ approval, clientStatus, ...props }) {
  const { onClose, open } = props;

  const [reason, setReason] = useState("");
  const [confirmReason, setConfirmReason] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [viewedTabs, setViewedTabs] = useState({
    "Personal Info": false,
    "Terms and Conditions": false,
    Attachments: false,
  });

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
    ? "You have a new customer approval."
    : `${selectedRowData?.businessName}'s registration request has been approved.`;
  const messageReceiverMessageRejected = `${selectedRowData?.businessName}'s registration request has been rejected.`;

  const snackbar = useSnackbar();

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

  //Constants
  const navigators = [
    { label: "Personal Info", disabled: false },
    { label: "Terms and Conditions", disabled: false },
    { label: "Attachments", disabled: false },
    { label: "Freebies", disabled: false },
    { label: "Listing Fee", disabled: false },
    { label: "Other Expenses", disabled: false },
  ];

  navigators[1].disabled = approval && !viewedTabs["Personal Info"];
  navigators[2].disabled = approval && !viewedTabs["Terms and Conditions"];
  navigators[3].disabled = approval && !viewedTabs["Attachments"];
  navigators[4].disabled = approval && !viewedTabs["Freebies"];
  navigators[5].disabled = approval && !viewedTabs["Listing Fee"];

  // if (clientStatus !== "Approved") {
  //   for (let i = navigators.length - 1; i >= 3; i--) {
  //     navigators.splice(i, 1);
  //   }
  // }

  if (selectedRowData?.terms === "COD") {
    navigators.splice(2, 1);
  }

  //RTK Query
  const [putApproveClient, { isLoading: isApproveLoading }] =
    usePutApproveClientMutation();
  const [putRejectClient, { isLoading: isRejectLoading }] =
    usePutRejectClientMutation();
  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

  const [triggerListingFee, { data: listingFeeData }] =
    useLazyGetListingFeeByClientIdQuery();
  const [triggerExpenses, { data: otherExpensesData }] =
    useLazyGetOtherExpensesByClientIdQuery();

  //Handler Functions
  const handleClose = () => {
    onClose();
    setReason("");
    setConfirmReason(false);
    setActiveTab("Personal Info");
    setViewedTabs({
      "Personal Info": false,
      "Terms and Conditions": false,
      Attachments: false,
    });
  };

  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px", alignItems: "center" }}>
      <Box
        className={
          selectedRowData?.terms === "COD"
            ? "viewRegistrationModal__headersFive"
            : "viewRegistrationModal__headers"
        }
        // Removing freebies, listing fee, and other expenses in approval
        // className={
        //   clientStatus !== "Approved" && selectedRowData?.terms === "COD"
        //     ? "viewRegistrationModal__headersThree"
        //     : clientStatus !== "Approved" && selectedRowData?.terms !== "COD"
        //     ? "viewRegistrationModal__headersFour"
        //     : clientStatus === "Approved" && selectedRowData?.terms === "COD"
        //     ? "viewRegistrationModal__headersFive"
        //     : "viewRegistrationModal__headers"
        // }
      >
        {navigators.map((item, i) => (
          <Button
            key={i}
            className={
              "viewRegistrationModal__headers__item" +
              (activeTab === item.label ? " active" : "")
            }
            disabled={item.disabled}
            onClick={() => {
              setActiveTab(item.label);
            }}
          >
            <Typography>{item.label}</Typography>
          </Button>
        ))}
      </Box>
      <IconButton
        sx={{ color: "white !important", height: "40px", width: "40px" }}
        onClick={handleClose}
      >
        <Close />
      </IconButton>
    </Box>
  );

  const handleNext = () => {
    if (activeTab === "Personal Info") {
      setActiveTab("Terms and Conditions");
    } else if (
      activeTab === "Terms and Conditions" &&
      selectedRowData?.terms !== "COD"
    ) {
      setActiveTab("Attachments");
    } else if (
      activeTab === "Terms and Conditions" &&
      selectedRowData?.terms === "COD"
    ) {
      setActiveTab("Freebies");
    } else if (activeTab === "Attachments") {
      setActiveTab("Freebies");
    } else if (activeTab === "Freebies") {
      setActiveTab("Listing Fee");
    } else if (activeTab === "Listing Fee") {
      setActiveTab("Other Expenses");
    }
  };

  const handleBack = () => {
    if (activeTab === "Terms and Conditions") {
      setActiveTab("Personal Info");
    } else if (activeTab === "Attachments") {
      setActiveTab("Terms and Conditions");
    } else if (activeTab === "Freebies" && selectedRowData?.terms !== "COD") {
      setActiveTab("Attachments");
    } else if (activeTab === "Freebies" && selectedRowData?.terms === "COD") {
      setActiveTab("Terms and Conditions");
    } else if (activeTab === "Listing Fee") {
      setActiveTab("Freebies");
    } else if (activeTab === "Other Expenses") {
      setActiveTab("Listing Fee");
    }
  };

  const handleApprove = async () => {
    try {
      await putApproveClient({
        id: selectedRowData?.requestId,
        ...(listingFeeData?.listingFees?.[0]?.listingItems?.length > 0 && {
          ListingFeeRequestId: listingFeeData?.listingFees?.[0]?.requestId,
        }),
        ...(otherExpensesData?.expenses?.[0]?.expenses?.length > 0 && {
          OtherExpensesRequestId: otherExpensesData?.expenses?.[0]?.requestId,
        }),
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameApproved}! ${messageReceiverMessageApproved}`,
        mobile_number: `+63${messageReceiverNumberApproved}`,
      }).unwrap();

      snackbar({ message: "Client approved successfully", variant: "success" });

      handleClose();
    } catch (error) {
      if (error.function !== "sendMessage") {
        onApproveConfirmClose();
        return snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      snackbar({
        message:
          "Registration approved successfully but failed to send message.",
        variant: "warning",
      });
      handleClose();
    }

    onApproveConfirmClose();
  };

  const handleRejectConfirmClose = () => {
    setReason("");
    setConfirmReason(false);
    onRejectConfirmClose();
  };

  const handleReject = async () => {
    try {
      await putRejectClient({
        id: selectedRowData?.requestId,
        body: { reason },
        ...(listingFeeData?.listingFees?.[0]?.listingItems?.length > 0 && {
          ListingFeeRequestId: listingFeeData?.listingFees?.[0]?.requestId,
        }),
        ...(otherExpensesData?.expenses?.[0]?.expenses?.length > 0 && {
          OtherExpensesRequestId: otherExpensesData?.expenses?.[0]?.requestId,
        }),
      }).unwrap();

      await sendMessage({
        message: `Fresh morning ${messageReceiverNameRejected}! ${messageReceiverMessageRejected}`,
        mobile_number: `+63${messageReceiverNumberRejected}`,
      }).unwrap();

      snackbar({ message: "Client rejected successfully", variant: "success" });
    } catch (error) {
      if (error.function !== "sendMessage") {
        return snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      snackbar({
        message:
          "Registration rejected successfully but failed to send message.",
        variant: "warning",
      });
    }

    handleRejectConfirmClose();
    handleClose();
  };

  useEffect(() => {
    setViewedTabs((prev) => ({
      ...prev,
      [activeTab]: true,
    }));
  }, [activeTab]);

  useEffect(() => {
    if (open) {
      triggerListingFee(
        {
          id: selectedRowData?.id,
        },
        { preferCacheValue: true }
      );
      triggerExpenses(
        {
          id: selectedRowData?.id,
        },
        { preferCacheValue: true }
      );
    }
  }, [open, selectedRowData?.id, triggerListingFee, triggerExpenses]);

  return (
    <>
      <CommonModal
        width="900px"
        // height="680px"
        // height="660px"
        height="90vh"
        overflow="auto"
        disablePadding
        ribbon
        customRibbonContent={customRibbonContent}
        ribbonPadding={"10px"}
        {...props}
      >
        <Box className="viewRegistrationModal">
          {activeTab === "Personal Info" && <PersonalInfoTab />}
          {activeTab === "Terms and Conditions" && <TermsAndConditionsTab />}
          {activeTab === "Attachments" && <AttachmentsTab />}
          {activeTab === "Freebies" && <FreebiesTab />}
          {activeTab === "Listing Fee" && <ListingFeeTab />}
          {activeTab === "Other Expenses" && <OtherExpensesTab />}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // gap: "10px",
              position: "absolute",
              bottom: "20px",
              // right: "20px",
              width: "calc(100% - 40px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                // justifyContent: "end",
                justifyContent:
                  activeTab === "Personal Info" ? "end" : "space-between",
                flex: 1,
              }}
            >
              {activeTab !== "Personal Info" && (
                <DangerButton onClick={handleBack}>Back</DangerButton>
              )}
              {/* <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                }}
              > */}
              {/* {!approval && (
                  <AccentButton
                    sx={{ color: "white !important" }}
                    onClick={() => {
                      setEditMode(true);
                      onRegisterOpen();
                    }}
                  >
                    Edit
                  </AccentButton>
                )} */}
              {activeTab !== navigators[navigators?.length - 1]?.label && (
                <SecondaryButton onClick={handleNext}>Next</SecondaryButton>
              )}
              {/* </Box> */}
              {activeTab ===
                // "Listing Fee"
                navigators[navigators?.length - 1]?.label &&
                approval &&
                clientStatus === "Under review" && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        gap: "10px",
                      }}
                    >
                      <DangerButton contained onClick={onRejectConfirmOpen}>
                        Reject
                      </DangerButton>

                      <SecondaryButton onClick={onApproveConfirmOpen}>
                        Approve
                      </SecondaryButton>
                    </Box>
                  </>
                )}
            </Box>
          </Box>
        </Box>
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
            Are you sure you want to approve{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.businessName || "client"}
            </span>
            ?
          </CommonDialog>

          <CommonDialog
            onClose={handleRejectConfirmClose}
            open={isRejectConfirmOpen}
            onYes={handleReject}
            isLoading={isRejectLoading || isSendMessageLoading}
            disableYes={!confirmReason || !reason.trim()}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box>
                Are you sure you want to reject{" "}
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

export default ViewRegistrationDetailsModal;
