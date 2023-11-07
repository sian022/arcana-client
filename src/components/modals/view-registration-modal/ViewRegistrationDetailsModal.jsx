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
import useDisclosure from "../../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import CommonDialog from "../../CommonDialog";
import { Close } from "@mui/icons-material";

function ViewRegistrationDetailsModal({ approval, ...props }) {
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
  ];

  navigators[1].disabled = approval && !viewedTabs["Personal Info"];
  navigators[2].disabled = approval && !viewedTabs["Terms and Conditions"];

  const handleClose = () => {
    onClose();
    setReason("");
    setConfirmReason("false");
    setActiveTab("Personal Info");
    setViewedTabs({
      "Personal Info": false,
      "Terms and Conditions": false,
      Attachments: false,
    });
  };

  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
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
      <IconButton sx={{ color: "white !important" }} onClick={handleClose}>
        <Close />
      </IconButton>
    </Box>
  );

  const handleNext = () => {
    if (activeTab === "Personal Info") {
      setActiveTab("Terms and Conditions");
    } else if (activeTab === "Terms and Conditions") {
      setActiveTab("Attachments");
    }
  };

  const handleBack = () => {
    if (activeTab === "Terms and Conditions") {
      setActiveTab("Personal Info");
    } else if (activeTab === "Attachments") {
      setActiveTab("Terms and Conditions");
    }
  };

  const handleApprove = () => {
    onApproveConfirmClose();
    onClose();
  };

  const handleReject = () => {
    setReason("");
    setConfirmReason(false);
    onRejectConfirmClose();
    onClose();
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
        height="660px"
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
              {activeTab !== "Attachments" && (
                <SecondaryButton onClick={handleNext}>Next</SecondaryButton>
              )}
              {activeTab === "Attachments" && approval && (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "end", gap: "10px" }}
                  >
                    <SecondaryButton onClick={onApproveConfirmOpen}>
                      Approve
                    </SecondaryButton>
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
            noIcon
          >
            Are you sure you want to approve{" "}
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

export default ViewRegistrationDetailsModal;
