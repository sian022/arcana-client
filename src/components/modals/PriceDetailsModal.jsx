import React, { useRef } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  IconButton,
  Step,
  StepButton,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import {
  Cancel,
  Check,
  CheckCircle,
  Circle,
  Close,
  EventNote,
  HowToReg,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

function PriceDetailsModal({ ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <CommonModal width="650px" {...otherProps}>
      <Typography>Price Details</Typography>
      <Box className="approvalHistoryModal__actions">
        <SecondaryButton onClick={onClose}>Confirm</SecondaryButton>
      </Box>
    </CommonModal>
  );
}

export default PriceDetailsModal;
