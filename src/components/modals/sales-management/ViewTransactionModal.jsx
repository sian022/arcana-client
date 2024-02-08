import React from "react";
import CommonModal from "../../CommonModal";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import UnderConstruction from "../../../assets/images/under-construction.svg";

function ViewTransactionModal({ ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <CommonModal closeTopRight {...props} width="1000px">
      <Typography fontWeight="700" fontSize="1.1rem" width="100%">
        Transaction Slip
      </Typography>

      <Box className="viewTransactionSlipModal">
        <Box className="viewTransactionSlipModal__header">
          <Box
            className="viewTransactionSlipModal__header__logo"
            sx={{
              bgcolor: "gray",
              width: "200px",
              height: "50px",
              borderRadius: "5px",
            }}
          />

          <Typography>
            Purok 06 Brgy. Lara, City of San Fernando, Pampanga
          </Typography>
        </Box>

        {/* <img src={UnderConstruction} alt="under-construction" width="400px" />
        <Typography fontWeight="500" fontSize="1.2rem">
          Under Construction!
        </Typography> */}
      </Box>
    </CommonModal>
  );
}

export default ViewTransactionModal;
