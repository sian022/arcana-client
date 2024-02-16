import { useEffect, useRef, useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, Divider, Input, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { FileUpload } from "@mui/icons-material";
import SecondaryButton from "../../SecondaryButton";
import DangerButton from "../../DangerButton";
import useSnackbar from "../../../hooks/useSnackbar";
import { useUploadCiAttachmentMutation } from "../../../features/sales-transaction/api/salesTransactionApi";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import moment from "moment/moment";
import useConfirm from "../../../hooks/useConfirm";

function ViewAttachmentModal({ ...props }) {
  const { onClose, open } = props;

  const [uploadAttachment, setUploadAttachment] = useState(null);
  const [currentAttachment, setCurrentAttachment] = useState(null);

  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const uploadRef = useRef();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //RTK Query
  const [uploadCiAttachment, { isUploadLoading }] =
    useUploadCiAttachmentMutation();

  //Functions
  const onUpload = async () => {
    const formData = new FormData();

    try {
      await confirm({
        children: (
          <>
            Are you sure you want to upload CI attachment for CI No.{" "}
            <span style={{ fontWeight: "700" }}>20012</span>?
          </>
        ),
        question: true,
        callback: () => {
          uploadAttachment({ id: selectedRowData?.id }).unwrap();
        },
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
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
          <Typography>
            {currentAttachment
              ? currentAttachment?.name
              : "No attachment found"}
          </Typography>

          {currentAttachment && (
            <Typography>{moment().format("MM/DD/YYYY")}</Typography>
          )}
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
          <SecondaryButton onClick={onUpload} disabled={!currentAttachment}>
            Upload
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ViewAttachmentModal;
