import React, { useRef } from "react";
import CommonModal from "../CommonModal";
import { Box, Typography } from "@mui/material";
import DangerButton from "../DangerButton";
import SecondaryButton from "../SecondaryButton";
import TertiaryButton from "../TertiaryButton";
import ReactSignatureCanvas from "react-signature-canvas";

function SignatureCanvasModal({ signature, setSignature, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  //Signature Canvas Functions
  const signCanvasRef = useRef();
  const clear = () => signCanvasRef.current.clear();

  const handleClearSign = () => {
    clear();
    setSignature("");
  };

  const handleCancel = () => {
    onClose();
    // handleClearSign();
  };

  const handleConfirm = () => {
    if (!signCanvasRef.current.isEmpty()) {
      setSignature(signCanvasRef.current.getTrimmedCanvas().toDataURL());
    }
    onClose();
  };
  return (
    <CommonModal width="auto" {...noOnCloseProps}>
      <Box className="signatureCanvasModal">
        <Typography className="signatureCanvasModal__title">
          Sign Here
        </Typography>
        <Box className="signatureCanvasModal__canvas">
          <ReactSignatureCanvas
            ref={signCanvasRef}
            canvasProps={{ width: "800px", height: "400px" }}
            // onEnd={() => setSignature(signCanvasRef.current.toDataURL())}
          />
        </Box>
        <Box className="signatureCanvasModal__actions">
          <DangerButton onClick={handleCancel}>Cancel</DangerButton>
          <Box className="signatureCanvasModal__actions__right">
            <TertiaryButton
              onClick={handleClearSign}
              sx={{ color: "white !important" }}
            >
              Clear
            </TertiaryButton>
            <SecondaryButton onClick={handleConfirm}>Confirm</SecondaryButton>
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default SignatureCanvasModal;
