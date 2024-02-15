import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, Divider, Input, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { FileUpload } from "@mui/icons-material";
import SecondaryButton from "../../SecondaryButton";
import DangerButton from "../../DangerButton";
import useSnackbar from "../../../hooks/useSnackbar";
import { useUploadCiAttachmentMutation } from "../../../features/sales-transaction/api/salesTransactionApi";

function ViewAttachmentModal({ ...props }) {
  const { onClose, open } = props;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const snackbar = useSnackbar();

  const [uploadAttachment, setUploadAttachment] = useState(null);
  const [currentAttachment, setCurrentAttachment] = useState(null);

  const uploadRef = useRef();

  //RTK Query
  const [uploadCiAttachment, { isUploadLoading }] =
    useUploadCiAttachmentMutation();

  //Functions
  const onUploadSubmit = async () => {
    const formData = new FormData();

    try {
      await uploadAttachment({ id: selectedRowData?.id }).unwrap();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else if (error?.status === 404) {
        snackbar({ message: "0404 Not Found", variant: "error" });
      } else {
        snackbar({ message: "Error uploading attachment", variant: "error" });
      }
    }
  };

  //UseEffect
  useEffect(() => {
    if (!open) setCurrentAttachment(null);
  }, [open]);

  return (
    <CommonModal width="666px" closeTopRight {...props}>
      <Box className="viewAttachmentModal">
        <Box className="viewAttachmentModal__title">
          <Typography fontWeight="700" fontSize="1.2rem">
            Attachment
          </Typography>

          <Typography fontWeight="500" fontSize="1.2rem">
            CI No. {selectedRowData?.["CINo."]}
          </Typography>
        </Box>

        <Divider />

        <Box className="viewAttachmentModal__labels">
          <Box className="viewAttachmentModal__labels__name">
            <Typography>
              {currentAttachment
                ? currentAttachment?.name
                : "No attachment found"}
            </Typography>
          </Box>
        </Box>

        <Box
          className="viewAttachmentModal__canvas"
          onClick={() => uploadRef.current.click()}
        >
          <Input
            type="file"
            onChange={(e) => setCurrentAttachment(e.target.files[0])}
            inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
            sx={{ display: "none" }}
            inputRef={uploadRef}
          />

          {currentAttachment ? (
            <img
              src={URL.createObjectURL(currentAttachment)}
              alt="attachment-preview"
              style={{
                borderRadius: "5px",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          ) : (
            <>
              <FileUpload sx={{ fontSize: "5rem", color: "#33333361" }} />
              <Typography fontWeight="500" color="#333333A8" fontSize="1.1rem">
                Upload CI attachment
              </Typography>
            </>
            // <>
            //   <img src={BlankCanvas} alt="blank-canvas" width="250px" />
            //   <Typography fontWeight="500" fontSize="1.1rem">
            //     No attachment found
            //   </Typography>
            // </>
          )}
        </Box>

        <Box className="viewAttachmentModal__actions">
          <DangerButton onClick={onClose}>Close</DangerButton>
          <SecondaryButton
            onClick={onUploadSubmit}
            disabled={!currentAttachment}
          >
            Upload
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ViewAttachmentModal;
