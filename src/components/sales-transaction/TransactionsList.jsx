import React from "react";
import DangerButton from "../DangerButton";
import { Box } from "@mui/material";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";

function TransactionsList({ setTransactionsMode }) {
  return (
    <Box>
      <DangerButton
        onClick={() => {
          setTransactionsMode(false);
          sessionStorage.removeItem("transactionsMode");
        }}
      >
        <KeyboardDoubleArrowLeft /> Back to POS
      </DangerButton>
    </Box>
  );
}

export default TransactionsList;
