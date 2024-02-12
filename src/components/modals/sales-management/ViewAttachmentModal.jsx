import React, { useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import BlankCanvas from "../../../assets/images/blank-canvas.svg";

function ViewAttachmentModal({ ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [currentAttachment, setCurrentAttachment] = useState(null);

  return (
    <CommonModal width="666px" closeTopRight {...props}>
      <Box className="viewAttachmentModal">
        <Typography fontWeight="700" fontSize="1.5rem" width="100%">
          Attachment - CI No. {selectedRowData?.["CINo."]}
        </Typography>

        <TextField
          type="file"
          onChange={(e) => setCurrentAttachment(e.target.files[0])}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
        />

        <Box className="viewAttachmentModal__canvas">
          {currentAttachment ? (
            <img
              src={URL.createObjectURL(currentAttachment)}
              alt="attachment-preview"
              style={{
                borderRadius: "5px",
                // width: "800px",
                // height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          ) : (
            <>
              <img src={BlankCanvas} alt="blank-canvas" width="250px" />
              <Typography fontWeight="500" fontSize="1.1rem">
                No attachment found
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ViewAttachmentModal;
