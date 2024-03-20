import { Box, TextField, Typography } from "@mui/material";
import CommonModal from "../../CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { setTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";
import DangerButton from "../../DangerButton";
import SecondaryButton from "../../SecondaryButton";
import { useEffect, useRef, useState } from "react";

function FreezerAssetTagModal({ ...props }) {
  const { onClose, open } = props;

  const [tagNumber, setTagNumber] = useState("");

  //Hooks
  const freezerAssetTagRef = useRef();
  const dispatch = useDispatch();
  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );

  //Functions
  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      setTermsAndConditions({
        property: "freezerAssetTag",
        value: tagNumber,
      })
    );

    // handleClose();
    onClose();
  };

  const handleClose = () => {
    onClose();
    setTagNumber("");

    dispatch(setTermsAndConditions({ property: "freezer", value: false }));
  };

  //UseEffect
  useEffect(() => {
    if (open) {
      setTagNumber(termsAndConditions.freezerAssetTag || "");

      setTimeout(() => {
        freezerAssetTagRef.current.select();
      }, 0);
    }
  }, [open, termsAndConditions.freezerAssetTag]);

  // useEffect(() => {
  //   if (!open && !termsAndConditions["freezerAssetTag"]) {
  //     dispatch(setTermsAndConditions({ property: "freezer", value: false }));
  //   }
  // }, [open, termsAndConditions["freezerAssetTag"], dispatch]);

  return (
    <CommonModal width="400px" {...props} onClose={handleClose} closeTopRight>
      <Box component="form" onSubmit={onSubmit}>
        <Typography fontSize="1.2rem" fontWeight="700">
          Freezer Asset Tag Number
        </Typography>

        <TextField
          inputRef={freezerAssetTagRef}
          label="Asset Tag"
          type="number"
          onChange={(e) => setTagNumber(e.target.value)}
          value={tagNumber}
          size="small"
          fullWidth
          sx={{ mt: "10px" }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <DangerButton onClick={handleClose}>Close</DangerButton>
          <SecondaryButton type="submit" disabled={!tagNumber}>
            Submit
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default FreezerAssetTagModal;
