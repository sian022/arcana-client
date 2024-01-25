import React, { useEffect, useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, TextField, Typography } from "@mui/material";
import SecondaryButton from "../../SecondaryButton";
import DangerButton from "../../DangerButton";
import { useSelector } from "react-redux";

function AddItemModal({ onSubmit, isValid, ...otherProps }) {
  const { onClose, open } = otherProps;
  const [quantity, setQuantity] = useState(1);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  useEffect(() => {
    setQuantity;
  }, [open]);

  return (
    <CommonModal {...otherProps} width="350px">
      <Box>
        <Typography fontSize="1.3rem" fontWeight="700">
          {selectedRowData?.itemCode}
        </Typography>
        <Typography fontSize="1.1rem">
          {selectedRowData?.itemDescription}
        </Typography>
      </Box>

      <TextField
        type="number"
        size="small"
        label="Quantity"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
        sx={{ mt: "10px" }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: "10px",
          marginTop: "20px",
        }}
        className="roleTaggingModal__actions"
      >
        <DangerButton onClick={onClose}>Close</DangerButton>
        <SecondaryButton onClick={onSubmit} disabled={!quantity}>
          Add Item
        </SecondaryButton>
      </Box>
    </CommonModal>
  );
}

export default AddItemModal;
