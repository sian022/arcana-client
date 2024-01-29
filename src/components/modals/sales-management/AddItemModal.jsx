import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, TextField, Typography } from "@mui/material";
import SecondaryButton from "../../SecondaryButton";
import DangerButton from "../../DangerButton";
import { useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";

function AddItemModal({ onSubmit, ...otherProps }) {
  const { onClose, open } = otherProps;
  const [quantity, setQuantity] = useState(1);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const quantityRef = useRef();

  //Functions
  const handleClose = () => {
    onClose();
    setQuantity(1);
  };

  const handleSubmit = () => {
    onSubmit(selectedRowData, quantity);
    handleClose();
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        quantityRef.current.select();
      }, 0);
    }
  }, [open]);

  return (
    <CommonModal {...otherProps} width="350px" closeTopRight>
      <Box component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography fontSize="1.3rem" fontWeight="700">
            {selectedRowData?.itemCode}
          </Typography>
          <Typography fontSize="1.1rem">
            {selectedRowData?.itemDescription}
          </Typography>
        </Box>

        <NumericFormat
          customInput={TextField}
          sx={{ mt: "10px", width: "100%" }}
          size="small"
          label="Quantity"
          type="text"
          onValueChange={(e) => setQuantity(e.value)}
          value={quantity}
          thousandSeparator=","
          autoComplete="off"
          inputRef={quantityRef}
          autoFocus
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
          <DangerButton onClick={handleClose}>Close</DangerButton>
          <SecondaryButton type="submit" disabled={!quantity}>
            Add Item
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default AddItemModal;
