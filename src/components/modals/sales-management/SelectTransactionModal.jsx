import React from "react";
import CommonModal from "../../CommonModal";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import UnderConstruction from "../../../assets/images/under-construction.svg";

function SelectTransactionModal({ ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <CommonModal closeTopRight {...props}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Typography fontWeight="700" fontSize="1.5rem" width="100%">
          Transaction Slip
        </Typography>
        <img src={UnderConstruction} alt="under-construction" width="400px" />
        <Typography fontWeight="500" fontSize="1.2rem">
          Under Construction!
        </Typography>
      </Box>
    </CommonModal>
  );
}

export default SelectTransactionModal;
