import React, { useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, Button, Typography } from "@mui/material";
import PersonalInfoTab from "./PersonalInfoTab";
import TermsAndConditionsTab from "./TermsAndConditionsTab";
import AttachmentsTab from "./AttachmentsTab";
import SecondaryButton from "../../SecondaryButton";
import DangerButton from "../../DangerButton";
import AccentButton from "../../AccentButton";

function ViewRegistrationDetailsModal({ ...props }) {
  const { onClose, ...noOnClose } = props;

  const [activeTab, setActiveTab] = useState("Personal Info");

  const navigators = ["Personal Info", "Terms and Conditions", "Attachments"];

  const customRibbonContent = (
    <Box className="viewRegistrationModal__headers">
      {navigators.map((item, i) => (
        <Button
          key={i}
          className={
            "viewRegistrationModal__headers__item" +
            (activeTab === item ? " active" : "")
          }
          onClick={() => {
            setActiveTab(item);
          }}
        >
          <Typography>{item}</Typography>
        </Button>
      ))}
    </Box>
  );
  return (
    <CommonModal
      width={"800px"}
      height="660px"
      disablePadding
      // paddingCustom="0 0 20px"
      ribbon
      customRibbonContent={customRibbonContent}
      {...noOnClose}
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
          <Box sx={{ display: "flex", gap: "10px" }}>
            <SecondaryButton onClick={onClose}>Approve</SecondaryButton>
            <DangerButton onClick={onClose}>Reject</DangerButton>
          </Box>
          <Box sx={{ display: "flex" }}>
            <AccentButton sx={{ color: "white !important" }} onClick={onClose}>
              Close
            </AccentButton>
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ViewRegistrationDetailsModal;