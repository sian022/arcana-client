import React, { useEffect, useState } from "react";
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

import SecondaryButton from "../../SecondaryButton";
import DangerButton from "../../DangerButton";
import AccentButton from "../../AccentButton";
import useDisclosure from "../../../hooks/useDisclosure";
import { useDispatch, useSelector } from "react-redux";
import CommonDialog from "../../CommonDialog";
import { Close } from "@mui/icons-material";
import {
  usePutApproveClientMutation,
  usePutRejectClientMutation,
} from "../../../features/registration/api/registrationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import SuccessButton from "../../SuccessButton";
import ListingFeeTab from "./ListingFeeTab";
import FreebiesTab from "./FreebiesTab";
import { notificationApi } from "../../../features/notification/api/notificationApi";
import { listingFeeApi } from "../../../features/listing-fee/api/listingFeeApi";

function ViewRegistrationDetailsModal({
  approval,
  onRegisterOpen,
  editMode,
  setEditMode,
  clientStatus,
  ...props
}) {
  const { onClose, ...noOnClose } = props;

  const [reason, setReason] = useState("");
  const [confirmReason, setConfirmReason] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [viewedTabs, setViewedTabs] = useState({
    "Personal Info": false,
    "Terms and Conditions": false,
    Attachments: false,
  });

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { showSnackbar } = useSnackbar();

  const dispatch = useDispatch();

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
    { label: "Listing Fee", disabled: false },
    { label: "Freebies", disabled: false },
  ];

  navigators[1].disabled = approval && !viewedTabs["Personal Info"];
  navigators[2].disabled = approval && !viewedTabs["Terms and Conditions"];
  navigators[3].disabled = approval && !viewedTabs["Attachments"];
  navigators[4].disabled = approval && !viewedTabs["Listing Fee"];

  //RTK Query
  const [putApproveClient, { isLoading: isApproveLoading }] =
    usePutApproveClientMutation();
  const [putRejectClient, { isLoading: isRejectLoading }] =
    usePutRejectClientMutation();

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
      <Box className="viewRegistrationModal__headers">
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
    } else if (activeTab === "Terms and Conditions") {
      setActiveTab("Attachments");
    } else if (activeTab === "Attachments") {
      setActiveTab("Listing Fee");
    } else if (activeTab === "Listing Fee") {
      setActiveTab("Freebies");
    }
  };

  const handleBack = () => {
    if (activeTab === "Terms and Conditions") {
      setActiveTab("Personal Info");
    } else if (activeTab === "Attachments") {
      setActiveTab("Terms and Conditions");
    } else if (activeTab === "Listing Fee") {
      setActiveTab("Attachments");
    } else if (activeTab === "Freebies") {
      setActiveTab("Listing Fee");
    }
  };

  const handleApprove = async () => {
    try {
      await putApproveClient({
        // id: selectedRowData?.id,
        id: selectedRowData?.requestId,
      }).unwrap();
      showSnackbar("Client approved successfully", "success");
      onApproveConfirmClose();
      handleClose();
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error approving client", "error");
      }
    }
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
        reason,
      }).unwrap();
      showSnackbar("Client rejected successfully", "success");
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
      dispatch(listingFeeApi.util.invalidateTags(["Listing Fee"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error rejecting client", "error");
      }
    }

    handleRejectConfirmClose();
    handleClose();
  };

  useEffect(() => {
    setViewedTabs({
      ...viewedTabs,
      [activeTab]: true,
    });
  }, [activeTab]);

  return (
    <>
      <CommonModal
        width="800px"
        // width="900px"
        height="670px"
        disablePadding
        ribbon
        customRibbonContent={customRibbonContent}
        // {...noOnClose}
        {...props}
      >
        <Box className="viewRegistrationModal">
          {activeTab === "Personal Info" && <PersonalInfoTab />}
          {activeTab === "Terms and Conditions" && <TermsAndConditionsTab />}
          {activeTab === "Attachments" && <AttachmentsTab />}
          {activeTab === "Listing Fee" && <ListingFeeTab />}
          {activeTab === "Freebies" && <FreebiesTab />}
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
                <SuccessButton onClick={handleNext}>Next</SuccessButton>
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
                      <SuccessButton onClick={onApproveConfirmOpen}>
                        Approve
                      </SuccessButton>
                      <DangerButton onClick={onRejectConfirmOpen}>
                        Reject
                      </DangerButton>
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
            isLoading={isApproveLoading}
            noIcon
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
            isLoading={isRejectLoading}
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
                onChange={(e) => {
                  setReason(e.target.value);
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
